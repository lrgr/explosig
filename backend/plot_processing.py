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
  def muts_by_sig_points(region_width, chromosome, selected_sigs, selected_projects):
    if region_width < 50000 and chromosome in CHROMOSOMES.keys():
      return None

    num_regions = CHROMOSOMES[chromosome] // region_width
    regions_matrix = np.zeros((len(ALL_SIGNATURES), num_regions), dtype=np.int16)

    print("regions matrix shape: %s" % str(regions_matrix.shape))

    for proj_id in selected_projects:
      ssm_filepath = os.path.join(SSM_W_SIGS_DIR, ("ssm_w_sigs.%s.tsv" % proj_id))
      if os.path.isfile(ssm_filepath):
        ssm_df = pd.read_csv(ssm_filepath, sep='\t')
        ssm_df['region'] = ssm_df.apply(lambda row: row['chromosome_start'] // region_width, axis=1) 
        # aggregate
        groups = ssm_df.groupby(['region', 'signature'])
        counts = groups.size().reset_index(name='counts')
        # assign
        try:
          # TODO: apply should not be used on funcs with side effects
          counts.apply(lambda row: operator.setitem(regions_matrix[row['signature'] - 1], row['region'], (row['counts'] + regions_matrix[row['signature'] - 1][row['region']])), axis=1)
        except IndexError as e:
          print(e)

    return PlotProcessing.np_as_file(regions_matrix)

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
    dataset_filepath = os.path.join(SIGS_DIR, sig_source, sig_source + ".tsv")
    sig_df = pd.read_csv(dataset_filepath, sep='\t')
    return PlotProcessing.pd_as_file(sig_df)



