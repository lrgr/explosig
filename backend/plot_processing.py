import pandas as pd
import os
import glob
import io
from constants import *

class PlotProcessing():

  @staticmethod
  def pd_as_file(df, index_val=True):
    output = io.StringIO()
    df.to_csv(output, sep='\t', index=index_val)
    return output.getvalue()

  @staticmethod
  def muts_by_sig_points(region_width, chromosome, sig_source, sig_restriction, projects):
    # validation
    if region_width < 10000: # will be too slow, stop processing
      return None
    # more validation
    sig_source_filepath = os.path.join(SIGS_DIR, sig_source, "signatures.tsv")
    if not os.path.isfile(sig_source_filepath):
      return None
    
    sig_names = list(pd.read_csv(sig_source_filepath, sep='\t')["name"].unique())
    region_names = list(range(0, CHROMOSOMES[chromosome], region_width))
    # regions_master_df: sigs x regions
    regions_master_df = pd.DataFrame(index=sig_names, columns=region_names)

    for proj_id in projects:
      ssm_filepath = os.path.join(SSM_W_SIGS_DIR, sig_source, sig_restriction, ("ssm.%s.tsv" % proj_id))
      if os.path.isfile(ssm_filepath):
        ssm_df = pd.read_csv(ssm_filepath, sep='\t')
        # restrict to current chromosome
        ssm_df = ssm_df[ssm_df["chromosome"] == chromosome]
        # set region values
        ssm_df['region'] = ssm_df.apply(lambda row: row['chromosome_start'] // region_width * region_width, axis=1) 

        # aggregate
        groups = ssm_df.groupby(['region', 'signature'])
        counts = groups.size().reset_index(name='counts')   
        regions_df = counts.pivot(index='signature', columns='region', values='counts')
        # sum
        regions_master_df = regions_master_df.add(regions_df, fill_value=0)
    
    # finalize
    regions_master_df.fillna(value=0, inplace=True)
    regions_master_df[list(regions_master_df.columns.values)] = regions_master_df[list(regions_master_df.columns.values)].astype(int)

    return PlotProcessing.pd_as_file(regions_master_df)

  @staticmethod
  def sigs(sig_source):
    sig_source_filepath = os.path.join(SIGS_DIR, sig_source, "signatures.tsv")
    if not os.path.isfile(sig_source_filepath):
      return None
    
    sig_df = pd.read_csv(sig_source_filepath, sep='\t')
    return PlotProcessing.pd_as_file(sig_df, index_val=False)

  @staticmethod
  def sigs_per_cancer(sig_source):
    active_sig_source_filepath = os.path.join(SIGS_DIR, sig_source, "active_binary.tsv")
    if not os.path.isfile(active_sig_source_filepath):
      return None
    
    active_sig_df = pd.read_csv(active_sig_source_filepath, sep='\t')
    return PlotProcessing.pd_as_file(active_sig_df, index_val=False)

  @staticmethod
  def data_listing_json():
    tsv_tree = {}
    curr_dir = None
    for path, dirs, files in os.walk(PROCESSED_DIR):
      # split_path = os.path.split(path)
      # curr_dir = split_path[-1]
      # for a_dir in dirs:
      #   tsv_tree.append(a_dir)
      print(path)
      print(dirs)
      print(files)
      print("end iteration")
    tsv_files = glob.glob(os.path.join(PROCESSED_DIR, "**", "*.tsv"), recursive=True)
    common_path = os.path.commonpath(tsv_files)
    tsv_files = list(map(lambda x: x[len(common_path):], tsv_files))
    return tsv_files

  @staticmethod
  def data_listing_tree(str_list):
    listing = {}
    for el in str_list:
      el_components = os.path.split(el)
      first_component = el_components[0]

    listing[first_component] = data_listing_tree()




