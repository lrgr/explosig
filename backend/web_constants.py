import os
import re

DATA_DIR = 'data'
PROCESSED_DIR = os.path.join(DATA_DIR, 'processed')

SIGS_DIR = os.path.join(PROCESSED_DIR, 'sigs')
SIGS_FILE = os.path.join(SIGS_DIR, 'signatures.tsv')
SIG_PRESETS_DIR = os.path.join(SIGS_DIR, 'presets')

SSM_DIR = os.path.join(PROCESSED_DIR, 'ssm')
DONOR_DIR = os.path.join(PROCESSED_DIR, 'donor')

SSM_FILE_PREFIX = 'ssm'
DONOR_FILE_PREFIX = 'donor'

CHROMOSOMES = {
  '1': 249250621,
  '2': 243199373,
  '3': 198022430,
  '4': 191154276,
  '5': 180915260,
  '6': 171115067,
  '7': 159138663,
  '8': 146364022,
  '9': 141213431,
  '10': 135534747,
  '11': 135006516,
  '12': 133851895,
  '13': 115169878,
  '14': 107349540,
  '15': 102531392,
  '16': 90354753,
  '17': 81195210,
  '18': 78077248,
  '19': 59128983,
  '20': 63025520,
  '21': 48129895,
  '22': 51304566,
  'X': 155270560,
  'Y': 59373566,
  'M': 16571
}

CHROMOSOME_RE = r'^(X|Y|M|[1-9]|1[0-9]|2[0-2])$'
PROJ_RE = r'^[A-Z0-9]+-[A-Z0-9]+-[A-Z]+$'
EXTRACT_PROJ_RE = r'^(?:ssm|donor)\.([A-Z0-9]+-[A-Z0-9]+-[A-Z]+)\.tsv$'

HEADERS = { 'Access-Control-Allow-Origin': '*' }