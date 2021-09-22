#!/bin/bash

APP_ENV="prod"

DEPLOYMENTPATH="{directory}"

currentVersion="$DEPLOYMENTPATH/current/version.txt"
futureVersion="$DEPLOYMENTPATH/prepare/version.txt"

sudo mv -T $DEPLOYMENTPATH/prepare $DEPLOYMENTPATH/current