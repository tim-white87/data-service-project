SERVICES_PORT ?= 4000

install-ui:
	cd ./ui && npm i

install: install-ui

.PHONY: start-ui
start-ui:
	cd ./ui && npm run start

build-services:
	echo $(PWD) && cd ./services && sam build

start-services: build-services
	@cd ./services && sam local start-api -p $(SERVICES_PORT)

.PHONY: start
start:
	$(MAKE) -j 4 start-services start-ui

build-ui:
	cd ./ui && npm run build

build: build-ui

deploy-ui: build-ui
	cd ./ui && aws s3 sync ./build/ s3://react-pokedex-challenge-tw --delete --acl public-read
	cd ./infrastructure && terraform output
	# TODO setup s3 bucket as env var derived from terraform outputs

deploy: deploy-ui
