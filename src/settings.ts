
export interface GlobalSettings {
  settings: {
    color: string;
  }
}

declare global {
  var settings: {
    color: string;
  }
}

export const initialSettings: GlobalSettings = {
  settings: {
    color: '#b80000',
  },
}


