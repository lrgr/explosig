import re

def json_or(req, varname, default, validate=None):
  try:
    val = req.json[varname]
    if not validate:
      return val
    else:
      regex = re.compile(validate)
      if isinstance(val, list):
        return list(filter(lambda x: regex.match(x).astype(bool), val))
      else:
        return val if regex.match(val) else default
  except:
    return default