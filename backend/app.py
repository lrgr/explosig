from sanic import Sanic, response
from constants import *
from validation_utils import *
from plot_processing import PlotProcessing

app = Sanic()

@app.post('/signature-genome-bins')
async def route_signature_genome_bins(req):
  region_width = int(json_or(req, 'region_width', 1000000, r'^\d+$'))
  chromosome = str(json_or(req, 'chromosome', "1", CHROMOSOME_RE))
  sig_source = json_or(req, 'sig_source', "cosmic", r'^[a-zA-Z0-9]+$')
  sig_restriction = json_or(req, 'sig_restriction', "all", r'^(all|active)$')
  projects = json_or(req, 'projects', ["PCAWG-BRCA-EU", "PCAWG-LIHC-US"], PROJ_RE)

  output = PlotProcessing.muts_by_sig_points(region_width, chromosome, sig_source, sig_restriction, projects)

  return response.text(output)

@app.post('/signatures')
async def route_signatures(req):
  sig_source = json_or(req, 'sig_source', "cosmic", r'^[a-zA-Z0-9]+$')
  output = PlotProcessing.sigs(sig_source)
  return response.text(output)

@app.post('/signatures-per-cancer')
async def route_signatures_per_cancer(req):
  sig_source = json_or(req, 'sig_source', "cosmic", r'^[a-zA-Z0-9]+$')
  output = PlotProcessing.sigs_per_cancer(sig_source)
  return response.text(output)

@app.post('/data-listing')
async def route_data_listing(req):
  output = PlotProcessing.data_listing_json()
  return response.json(output)

if __name__ == '__main__':
  app.run(host='0.0.0.0', port=8000)
