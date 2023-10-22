import {Platform, StatusBar, StatusBarProps} from 'react-native';
import {useMemo} from 'react';

const SystemStatusBar = (props: StatusBarProps) => {
  const barStyle = useMemo(() => {
    if (Platform.OS === 'android') {
      return props.barStyle === 'dark-content'
        ? 'light-content'
        : 'dark-content';
    }
    return props.barStyle;
  }, [props.barStyle]);

  const backgroundColor = useMemo(() => {
    if (Platform.OS === 'android') {
      return props.backgroundColor ?? 'white';
    }
    return props.backgroundColor;
  }, [props.backgroundColor]);

  return (
    <StatusBar
      {...props}
      barStyle={barStyle}
      backgroundColor={backgroundColor}
    />
  );
};

export default SystemStatusBar;
