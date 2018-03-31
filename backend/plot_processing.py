import numpy as np
import pandas as pd
import os
import glob
import re
import operator
import io
from constants import *

class PlotProcessing():

  data = {}

  @staticmethod
  def load():
    PlotProcessing.data['ssm_w_sigs'] = {}

    all_datasets = glob.glob(os.path.join(SSM_W_SIGS_DIR, "*.tsv"))
    for dataset_filepath in all_datasets:
      matches = re.match(r'.*ssm_w_sigs\.([A-Z\-]+)\.tsv$', dataset_filepath)
      proj_id = matches.group(1)
      PlotProcessing.data['ssm_w_sigs'][proj_id] = pd.read_csv(dataset_filepath, sep='\t')
       
  @staticmethod
  def muts_by_sig_points(region_width, selected_sigs, selected_projects):
    if region_width < 50000:
      return None
    cumulative_regions = PlotProcessing.get_cumulative_regions(region_width)
    num_regions = PlotProcessing.get_num_regions(region_width)

    regions_matrix = np.zeros((len(ALL_SIGNATURES), num_regions), dtype=np.int16)

    print("regions matrix shape: %s" % str(regions_matrix.shape))

    for proj_id in selected_projects:
      try:
        ssm_df = PlotProcessing.data['ssm_w_sigs'][proj_id]
        ssm_df['absolute_region'] = ssm_df.apply(lambda row: PlotProcessing.get_col(region_width, row['chromosome'], row['chromosome_start'], cumulative_regions), axis=1) 
        # aggregate
        groups = ssm_df.groupby(['absolute_region', 'signature'])
        counts = groups.size().reset_index(name='counts')
        # assign
        try:
          counts.apply(lambda row: operator.setitem(regions_matrix[row['signature'] - 1], row['absolute_region'], (row['counts'] + regions_matrix[row['signature'] - 1][row['absolute_region']])), axis=1)
        except IndexError as e:
          print(e)
      except KeyError as e:
        print(e)

    return PlotProcessing.as_file(regions_matrix)

  @staticmethod
  def get_cumulative_regions(region_width):
    num_regions = 0
    regions = {}
    for chr_name, chr_len in CHROMOSOMES.items():
      regions[chr_name] = num_regions
      num_regions += (chr_len // region_width) + 1
    return regions

  @staticmethod
  def get_num_regions(region_width):
    num_regions = 0
    for chr_name, chr_len in CHROMOSOMES.items():
      num_regions += (chr_len // region_width) + 1
    return num_regions

  @staticmethod
  def get_col(region_width, chr_name, position, cumulative_regions):
    try:
      absolute_position = cumulative_regions[chr_name]
    except KeyError as e:
      if chr_name == 'MT':
        absolute_position = cumulative_regions['M']
    absolute_position += (position // region_width)
    return absolute_position

  @staticmethod
  def as_file(matrix):
    output = io.BytesIO()
    np.savetxt(output, matrix, delimiter='\t', fmt='%i')
    return output



