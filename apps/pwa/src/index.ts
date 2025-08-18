/**
 * Minimal front-end client fetching tunes from the GraphQL server.
 */

const endpoint = process.env.GRAPHQL_ENDPOINT || 'http://localhost:4000/graphql';

interface Tune {
  thesession_id: number;
  title: string;
  type: string;
}

async function fetchTunes(type?: string): Promise<Tune[]> {
  const query = `query ($type: String){ tunes(type: $type) { thesession_id title type } }`;
  const res = await fetch(endpoint, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ query, variables: { type } })
  });
  const json = await res.json();
  return json.data.tunes;
}

async function main() {
  const [, , filterType] = process.argv;
  const tunes = await fetchTunes(filterType);
  console.log(`🎵 ${tunes.length} tune(s)${filterType ? ' of type ' + filterType : ''}`);
  tunes.forEach(t => console.log(`- ${t.title} (${t.type})`));
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});

export {};
