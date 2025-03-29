
export interface GlobalSettings {
  settings: {
    color: string;
    pattern: string;
  }
}

declare global {
  var settings: {
    color: string;
    pattern: string;
  }
}

export const initialSettings: GlobalSettings = {
  settings: {
    color: '#b80000',
    pattern: 'circle',
  },
}


