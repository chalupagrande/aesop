
export interface GlobalSettings {
  settings: {
    color: string;
    size: number;
    pattern: string;
  }
}

declare global {
  var settings: {
    color: string;
    size: number;
    pattern: string;
  }
}

export const initialSettings: GlobalSettings = {
  settings: {
    color: '#b80000',
    size: 1,
    pattern: 'circle',
  },
}


