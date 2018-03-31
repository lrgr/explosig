
all: frontend backend

signature-visualization-%end/Makefile:
	git submodule update

%end: signature-visualization-%end/Makefile
	cd signature-visualization-$@ && $(MAKE)
	
