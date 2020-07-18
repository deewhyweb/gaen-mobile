import React from 'react';
import {
  ViewStyle,
  View,
  StyleSheet,
  ScrollView,
  TouchableHighlight,
  TouchableOpacity,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { SvgXml } from 'react-native-svg';
import {
  NavigationParams,
  NavigationScreenProp,
  NavigationState,
} from 'react-navigation';

import { getLocalNames } from '../../locales/languages';
import { Typography } from '../../components/Typography';
import { NavigationBarWrapper } from '../../components/NavigationBarWrapper';
import { Stacks, Screens, useStatusBarEffect } from '../../navigation';

import { Icons } from '../../assets';
import {
  Buttons,
  Colors,
  Spacing,
  Typography as TypographyStyles,
} from '../../styles';

interface SettingsScreenProps {
  navigation: NavigationScreenProp<NavigationState, NavigationParams>;
}

interface LanguageSelectionListItemProps {
  icon: string;
  label: string;
  onPress: () => void;
}
const LanguageSelectionListItem = ({
  icon,
  label,
  onPress,
}: LanguageSelectionListItemProps) => (
  <TouchableHighlight
    underlayColor={Colors.underlayPrimaryBackground}
    style={styles.listItem}
    onPress={onPress}>
    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
      <SvgXml
        xml={icon}
        style={[styles.icon, { marginRight: Spacing.small }]}
      />
      <Typography use={'body1'}>{label}</Typography>
    </View>
  </TouchableHighlight>
);

const SettingsScreen = ({ navigation }: SettingsScreenProps): JSX.Element => {
  const {
    t,
    i18n: { language: localeCode },
  } = useTranslation();
  const languageName = getLocalNames()[localeCode];
  useStatusBarEffect('light-content');

  const navigateTo = (screen: string) => {
    return () => navigation.navigate(screen);
  };

  interface SettingsListItemProps {
    label: string;
    onPress: () => void;
    description?: string;
    style?: ViewStyle;
  }

  const SettingsListItem = ({
    label,
    onPress,
    description,
    style,
  }: SettingsListItemProps) => {
    return (
      <TouchableHighlight
        underlayColor={Colors.underlayPrimaryBackground}
        style={[styles.listItem, style]}
        onPress={onPress}>
        <View>
          <Typography style={styles.listItemText}>{label}</Typography>
          {description ? (
            <Typography style={styles.descriptionText}>
              {description}
            </Typography>
          ) : null}
        </View>
      </TouchableHighlight>
    );
  };

  return (
    <NavigationBarWrapper
      title={t('navigation.more')}
      includeBackButton={false}>
      <ScrollView style={styles.container}>
        <View style={styles.sectionPrimary}>
          <Typography>{t('settings.share_test_result_description')}</Typography>
          <TouchableOpacity
            onPress={navigateTo(Stacks.AffectedUserFlow)}
            style={styles.button}>
            <Typography style={styles.buttonText}>
              {t('settings.share_test_result')}
            </Typography>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <LanguageSelectionListItem
            label={languageName || t('label.unknown')}
            icon={Icons.LanguagesIcon}
            onPress={navigateTo(Screens.LanguageSelection)}
          />
        </View>

        <View style={styles.section}>
          <SettingsListItem
            label={t('screen_titles.about')}
            onPress={navigateTo(Screens.About)}
            style={styles.divider}
          />
          <SettingsListItem
            label={t('screen_titles.legal')}
            onPress={() => navigation.navigate(Screens.Licenses)}
            style={styles.lastListItem}
          />
        </View>
        <View style={styles.section}>
          <SettingsListItem
            label='EN Debug Menu'
            onPress={navigateTo(Screens.ENDebugMenu)}
            style={styles.lastListItem}
          />
        </View>
      </ScrollView>
    </NavigationBarWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.primaryBackground,
  },
  divider: {
    borderColor: Colors.tertiaryViolet,
    borderBottomWidth: 1,
  },
  section: {
    flex: 1,
    backgroundColor: Colors.white,
    marginBottom: Spacing.medium,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: Colors.tertiaryViolet,
  },
  sectionPrimary: {
    flex: 1,
    margin: Spacing.medium,
  },
  button: {
    ...Buttons.largeSecondaryBlue,
    marginTop: Spacing.medium,
  },
  buttonText: {
    ...TypographyStyles.buttonTextLight,
  },
  icon: {
    maxWidth: Spacing.icon,
    maxHeight: Spacing.icon,
  },
  listItem: {
    flex: 1,
    paddingHorizontal: Spacing.small,
    paddingVertical: Spacing.medium,
  },
  listItemText: {
    ...TypographyStyles.tappableListItem,
  },
  lastListItem: {
    borderBottomWidth: 0,
  },
  descriptionText: {
    ...TypographyStyles.description,
  },
});

export default SettingsScreen;
