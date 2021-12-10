#!/usr/bin/env bash
if [[ $# -ge 1 ]]; then
    aws s3 sync s3://$1 .logs
else
    echo 1>&2 "Provide bucket name as first argument."
    exit 1
fi
