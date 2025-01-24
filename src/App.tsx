import { useEffect } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { useSettings } from './providers/SettingsProvider';
import { AppRouting } from './routing';
import { PathnameProvider } from './providers';
import { Amplify } from 'aws-amplify';

const { BASE_URL } = import.meta.env;

Amplify.configure({
  Auth: {
    Cognito: {
      userPoolId: 'ap-southeast-1_eHEB0BLrp',
      userPoolClientId: '1spt2lqtab5hr8v4m38kdtnvno'
    }
  }
});

const App = () => {
  const { settings } = useSettings();

  useEffect(() => {
    document.documentElement.classList.remove('dark');
    document.documentElement.classList.remove('light');
    document.documentElement.classList.add(settings.mode);
  }, [settings]);

  return (
    <BrowserRouter basename={BASE_URL}>
      <PathnameProvider>
        <AppRouting />
      </PathnameProvider>
    </BrowserRouter>
  );
};

export { App };
