#!/bin/sh
fetch() {
    curl \
    -H 'User-Agent: Dalvik/2.1.0 (Linux; U; Android 9; ALP-AL00 Build/HUAWEIALP-AL00)' \
    -s \
    -w '{"response_code":%{response_code},"speed_download":%{speed_download},"time_connect":%{time_connect}}' \
    -o /dev/null \
    -L \
    --connect-timeout 3 \
    $1
}

check() {
    received=$(echo "$1" | jq -r ".response_code")
    expected=$2

    echo "Received: $received"
    echo "Expected: $expected"

    if [ "$received" = "$expected" ]; then
        exit 0
    else
        exit 1
    fi
}

# switch $1
case $1 in
    "umamusume")
        res=$(fetch "https://api-umamusume.cygames.jp/" | tee umamusume.json)
        check "$res" 404
        ;;
    "worldflipper")
        res=$(fetch "https://api.worldflipper.jp/" | tee worldflipper.json)
        check "$res" 200
        ;;
    "kancolle")
        res=$(fetch "http://203.104.209.7/kcscontents/news/" | tee kancolle.json)
        check "$res" 200
        ;;
    "konosuba")
        res=$(fetch "https://api.konosubafd.jp/" | tee konosuba.json)
        check "$res" 200
        ;;
    "kirara")
        res=$(fetch "https://kirara.star-api.com/cat_news/update" | tee kirara.json)
        check "$res" 200
        ;;
    *)
        exit 2
        ;;
esac