import pandas as pd
import os
import io
import re
import sys
import json
from web_constants import *

parent_dir_name = os.path.dirname(os.path.realpath(__file__))
sys.path.append(parent_dir_name + "/../signature-computation")
from signatures import Signatures
from constants import *

class PlotProcessing():

  @staticmethod
  def pd_as_file(df, index_val=True):
    output = io.StringIO()
    df.to_csv(output, index=index_val)
    return output.getvalue()

  @staticmethod
  def muts_by_sig_points(region_width, chromosome, sigs, projects):
    signatures = Signatures(SIGS_FILE, chosen_sigs=sigs)
    # validation
    if region_width < 10000: # will be too slow, stop processing
      return None
    
    sig_names = signatures.get_chosen_names()
    region_names = list(range(0, CHROMOSOMES[chromosome], region_width))
    # regions_master_df: sigs x regions
    regions_master_df = pd.DataFrame(index=sig_names, columns=region_names)

    for proj_id in projects:
      ssm_filepath = os.path.join(SSM_DIR, ("ssm.%s.tsv" % proj_id))
      donor_filepath = os.path.join(DONOR_DIR, ("donor.%s.tsv" % proj_id))
      if os.path.isfile(ssm_filepath) and os.path.isfile(donor_filepath):
        ssm_df = pd.read_csv(ssm_filepath, sep='\t', index_col=0)
        donor_df = pd.read_csv(donor_filepath, sep='\t', index_col=0)
        # restrict to current chromosome
        ssm_df = ssm_df[ssm_df[CHR] == chromosome]
        # set region values
        ssm_df['region'] = ssm_df.apply(lambda row: row[POS] // region_width * region_width, axis=1) 

        # set signature values
        # compute exposures
        counts_df = donor_df.drop(columns=[TOBACCO_BINARY, TOBACCO_INTENSITY, ALCOHOL_BINARY])
        counts_df = counts_df.dropna(axis=0, how='any')
        exps_df = signatures.get_exposures(counts_df)
        # compute assignments
        assignments_df = signatures.get_assignments(exps_df)
        # add signature column
        ssm_df['signature'] = ssm_df.apply(lambda row: assignments_df.loc[row[DONOR_ID], row[CONTEXT]] if pd.notnull(row[CONTEXT]) else None, axis=1)
        
        # aggregate
        groups = ssm_df.groupby(['region', 'signature'])
        counts = groups.size().reset_index(name='counts')   
        regions_df = counts.pivot(index='signature', columns='region', values='counts')
        # sum
        regions_master_df = regions_master_df.add(regions_df, fill_value=0)
    
    # finalize
    regions_master_df.fillna(value=0, inplace=True)
    regions_master_df[list(regions_master_df.columns.values)] = regions_master_df[list(regions_master_df.columns.values)].astype(int)
    return PlotProcessing.pd_as_file(regions_master_df.transpose())

  @staticmethod
  def sigs():
    sig_df = pd.read_csv(SIGS_FILE, sep='\t', index_col=0)
    return PlotProcessing.pd_as_file(sig_df, index_val=False)

  @staticmethod
  def sigs_per_cancer(sig_source):
    active_sig_source_filepath = os.path.join(SIG_PRESETS_DIR, sig_source + ".json")
    if not os.path.isfile(active_sig_source_filepath):
      return None
    with open(active_sig_source_filepath) as data_file:    
      active_sigs = json.load(data_file)
    return active_sigs

  @staticmethod
  def data_listing_json_aux(curr_path = PROCESSED_DIR):
    listing = {}
    files = []
    for name in os.listdir(curr_path):
      newpath = os.path.join(curr_path, name)
      if os.path.isdir(newpath):
        listing[name] = PlotProcessing.data_listing_json_aux(newpath)
      if os.path.isfile(newpath):
        if name.endswith(".tsv"):
          matches = re.match(EXTRACT_PROJ_RE, name)
          if matches != None:
            files.append(matches.group(1))
        elif name.endswith(".json"):
          sig_source = name[:-5]
          source_preset = PlotProcessing.sigs_per_cancer(sig_source)
          files.append({ 'name': sig_source, 'preset': source_preset })

    if len(list(listing.keys())) == 0:
      return files
    else:
      return listing

  @staticmethod
  def data_listing_json():
    signatures = Signatures(SIGS_FILE)
    return {
      "sources": PlotProcessing.data_listing_json_aux(SSM_DIR),
      "sigs": signatures.get_all_names(),
      "sig_presets": PlotProcessing.data_listing_json_aux(SIG_PRESETS_DIR)
    }

  @staticmethod
  def kataegis(chromosome, projects):
    width = 1000
    df_cols = [DONOR_ID, POS]
    df = pd.DataFrame([], columns=df_cols)
    for proj_id in projects:
      ssm_filepath = os.path.join(SSM_DIR, ("ssm.%s.tsv" % proj_id))
      if os.path.isfile(ssm_filepath):
        ssm_df = pd.read_csv(ssm_filepath, sep='\t', index_col=0)
        ssm_df = ssm_df.loc[ssm_df[CHR] == chromosome]
        katagis_df = ssm_df.loc[ssm_df[MUT_DIST_ROLLING_6] <= width][df_cols]
        df = df.append(katagis_df, ignore_index=True)
    return PlotProcessing.pd_as_file(df, index_val=False)
  
  @staticmethod
  def kataegis_rainfall(project, donor_id, chromosome):
    pass
