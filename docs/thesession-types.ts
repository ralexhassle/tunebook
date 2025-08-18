// Generated TypeScript types from TheSession.org data analysis
// Generated on: 2025-08-18T14:27:38.906Z

interface Tune {
  tune_id: string;
  setting_id: string;
  name: string;
  type: string;
  meter: string;
  mode: string;
  abc: string;
  date: string;
  username: string;
}

interface Recording {
  id: string;
  artist: string;
  recording: string;
  track: string;
  number: string;
  tune: string;
  tune_id: string;
}

interface Tune_popularit {
  name: string;
  tune_id: string;
  tunebooks: string;
}

interface Aliase {
  tune_id: string;
  alias: string;
  name: string;
}

