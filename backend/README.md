### API

POST: `/signature-genome-bins`
```
{
	"region_width": 5000000,
	"chromosome": "1",
	"sig_source": "cosmic",
	"sig_restriction": "all",
	"projects": ["PCAWG-PRAD-UK"]
}
```


POST: `/signatures`
```
{
	"sig_source": "cosmic"
}
```

POST: `/signatures-per-cancer`
```
{
	"sig_source": "cosmic"
}
```
