#!/usr/bin/env bash

apply () {
    for node in '' 2 3
    do
        launchctl $1 ~/Library/LaunchAgents/homebrew.mxcl.elasticsearch${node}.plist
    done
}

status () {
    ps ax | grep elasticsearch | grep -v "grep"
    curl 'http://localhost:9200/?pretty'
    curl 'http://localhost:9200/_cluster/health?pretty'
}

es_kill () {
    jps | grep "Elasticsearch" | cut -f1 -d' ' | xargs kill
}

case $1 in
    'down')
        apply 'unload'
        ;;
    'status')
        status
        ;;
    'kill')
        es_kill
        ;;
    *)
        apply 'load'
        ;;
esac