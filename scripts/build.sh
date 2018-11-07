# Set working directory to root (../)
cd "$(dirname "$0")"
cd "../"

yarn build
docker build -t lrgr/imuse .