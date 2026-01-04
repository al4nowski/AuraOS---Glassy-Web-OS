
export type AppId = 'terminal' | 'imageGen' | 'settings' | 'files';

export interface WindowState {
  id: AppId;
  title: string;
  isOpen: boolean;
  isMinimized: boolean;
  zIndex: number;
}

export interface AppIcon {
  id: AppId;
  icon: string;
  label: string;
  color: string;
}
