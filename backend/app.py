from sanic import Sanic, response
from constants import *
from plot_processing import PlotProcessing

app = Sanic()

def json_or(req, varname, default):
  try:
    return req.json[varname]
  except KeyError:
    return default

@app.post('/signature-genome-bins')
async def route_signature_genome_bins(req):
  region_width = json_or(req, 'region_width', 1000000)
  chromosome = json_or(req, 'chromosome', "1")
  sig_source = json_or(req, 'sig_source', list( map(str, range(1, 31) )))
  signatures = json_or(req, 'signatures', list( map(str, range(1, 31) )))
  projects = json_or(req, 'projects', ["BRCA-EU", "LIHC-US"])

  output = PlotProcessing.muts_by_sig_points(region_width, chromosome, sig_source, signatures, projects)

  return response.raw(output)

@app.post('/signatures')
async def route_signatures(req):
  try:
    sig_source = req.json['sig_source']
  except:
    sig_source = "cosmic"
  
  output = PlotProcessing.sigs(sig_source)

  return response.text(output)

if __name__ == '__main__':
  app.run(host='0.0.0.0', port=8000)
