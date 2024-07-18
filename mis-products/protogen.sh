#!/bin/bash --

PROTO_PATH="./proto"
PROTO_FILES=$(find $PROTO_PATH -name "*.proto")

for PROTO_FILE in $PROTO_FILES; do
  protoc \
    --plugin=protoc-gen-ts_proto=./node_modules/.bin/protoc-gen-ts_proto \
    --experimental_allow_proto3_optional \
    --ts_proto_out=./src \
    -I=$PROTO_PATH \
    $PROTO_FILE
done
