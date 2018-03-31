import numpy as np
import pandas as pd
import os
import glob
import re
import operator
import io
from constants import *

class PlotProcessing():

  @staticmethod
  def muts_by_sig_points(region_width, chromosome, sig_source, sig_restriction, projects):
    # validation
    if region_width < 10000: # will be too slow, stop processing
      return None
    # more validation
    sig_source_filepath = os.path.join(SIGS_DIR, sig_source + ".tsv")
    if not os.path.isfile(sig_source_filepath):
      return None
    
    sig_names = list(pd.read_csv(sig_source_filepath, sep='\t')["name"].unique())
    regions_master_df = None

    for proj_id in projects:
      ssm_filepath = os.path.join(SSM_W_SIGS_DIR, sig_source, sig_restriction, ("ssm.%s.tsv" % proj_id))
      if os.path.isfile(ssm_filepath):
        ssm_df = pd.read_csv(ssm_filepath, sep='\t')
        ssm_df['region'] = ssm_df.apply(lambda row: row['chromosome_start'] // region_width, axis=1) 

        # aggregate
        groups = ssm_df.groupby(['region', 'signature'])
        counts = groups.size().reset_index(name='counts')

        region_categories = pd.Categorical(counts['region'], categories=list(range(0, CHROMOSOMES[chromosome], region_width)))
        sig_categories = pd.Categorical(counts['signature'], categories=sig_names)
        regions_df = pd.crosstab(region_categories, sig_categories)

        if regions_master_df is None:
          regions_master_df = regions_df
        else:
          regions_master_df = regions_master_df.add(regions_df, fill_value=0)

    return PlotProcessing.pd_as_file(regions_master_df)

  @staticmethod
  def np_as_file(matrix):
    output = io.BytesIO()
    np.savetxt(output, matrix, delimiter='\t', fmt='%i')
    return output.getvalue()

  @staticmethod
  def pd_as_file(df):
    output = io.StringIO()
    df.to_csv(output, sep='\t')
    return output.getvalue()

  @staticmethod
  def sigs(sig_source):
    sig_source_filepath = os.path.join(SIGS_DIR, sig_source + ".tsv")
    if not os.path.isfile(sig_source_filepath):
      return None
    
    sig_df = pd.read_csv(sig_source_filepath, sep='\t')
    return PlotProcessing.pd_as_file(sig_df)



