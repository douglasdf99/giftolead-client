# if [ "$PROFILE" = 'staging' ]; then
#   sops -d -i .env-staging || true
#   cp .env-staging ./dist/.env
# fi

nginx -g 'daemon off;'
