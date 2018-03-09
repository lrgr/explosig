import numpy as np
import pandas as pd
import os
import glob
import re
import io
from constants import *

class PlotProcessing():

  data = {}

  @staticmethod
  def load():
    PlotProcessing.data['ssm_w_sigs'] = {}

    all_datasets = glob.glob(os.path.join(SSM_W_SIGS_DIR, ".tsv"))
    for dataset_filepath in all_datasets:
      matches = re.match(r'.*ssm_w_sigs\.([A-Z\-]+)\.tsv$', dataset_filepath)
      proj_id = matches.group(1)
      PlotProcessing.data['ssm_w_sigs'][proj_id] = pd.read_csv(dataset_filepath, sep='\t')
       
  @staticmethod
  def muts_by_sig_points(region_width, selected_sigs, selected_projects):
    if region_width < 50000:
      return None
    region_starts = np.array([])
    for chr_name, chr_len in CHROMOSOMES.items():
      chr_regions = np.core.defchararray.mod((chr_name + "_%d"), np.arange(0, chr_len, region_width))
      region_starts = np.concatenate([region_starts, chr_regions])


    #region_dtypes = [(i, np.int16) for i in list(region_starts)]

    #regions_matrix = np.recarray(np.zeros((len(ALL_SIGNATURES), region_starts.size)), dtype=region_dtypes)
    #regions_matrix = np.zeros((30, 5), dtype=region_dtypes[1:6])
    regions_matrix = np.zeros((len(ALL_SIGNATURES), region_starts.size), dtype=np.int16)

    return PlotProcessing.as_file(regions_matrix)

  @staticmethod
  def as_file(matrix):
    output = io.BytesIO()
    np.savetxt(output, matrix, delimiter='\t', fmt='%i')
    return output



