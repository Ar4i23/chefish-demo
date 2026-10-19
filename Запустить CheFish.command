#!/bin/zsh
set -u

cd -- "${0:A:h}" || exit 1

matches_site() {
  /usr/bin/curl --silent --show-error --fail --max-time 2 "$1" 2>/dev/null \
    | /usr/bin/grep -q 'CheFish — шаурма и комбо в Батуми'
}

for port in {5176..5185}; do
  url="http://127.0.0.1:${port}/"

  if matches_site "$url"; then
    /usr/bin/open "$url"
    exit 0
  fi

  if ! /usr/bin/nc -z 127.0.0.1 "$port" >/dev/null 2>&1; then
    (
      for attempt in {1..80}; do
        if matches_site "$url"; then
          /usr/bin/open "$url"
          exit 0
        fi
        /bin/sleep 0.25
      done
    ) &

    PORT="$port" npm run dev
    exit $?
  fi
done

print -u2 'Не нашёл свободный порт в диапазоне 5176–5185. Закройте старые серверы CheFish и попробуйте снова.'
exit 1
