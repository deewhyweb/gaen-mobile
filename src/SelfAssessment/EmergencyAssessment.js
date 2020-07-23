import React from "react"
import { View, StyleSheet } from "react-native"
import { useTranslation } from "react-i18next"

import {
  QUESTION_KEY_AGREE,
  SCREEN_TYPE_RADIO,
  SCREEN_TYPE_EMERGENCY,
} from "./constants"
import { Info } from "./Info"
import { InfoText } from "./InfoText"
import { Button } from "./Button"
import { RTLEnabledText } from "../components/RTLEnabledText"

import { Colors } from "../styles"

/** @type {React.FunctionComponent<{}>} */
export const EmergencyAssessment = ({ navigation }) => {
  const { t } = useTranslation()

  const handleAgreePress = () => {
    navigation.push(SCREEN_TYPE_EMERGENCY)
  }

  const handleDisagreePress = () => {
    navigation.push("AssessmentQuestion", {
      question: agreeQuestion,
      option: agreeOption,
    })
  }

  return (
    <Info
      backgroundColor={Colors.surveyPrimaryBackground}
      footer={
        <ChoiceButtons
          agreePress={handleAgreePress}
          agreeTitle={
            <RTLEnabledText style={styles.boldText}>
              {t("assessment.i_am") + " "}
              <RTLEnabledText style={styles.regularText}>
                {t("assessment.experiencing_symptoms")}
              </RTLEnabledText>
            </RTLEnabledText>
          }
          disagreePress={handleDisagreePress}
          disagreeTitle={
            <RTLEnabledText style={styles.boldText}>
              {t("assessment.i_am_not") + " "}
              <RTLEnabledText style={styles.regularText}>
                {t("assessment.experiencing_symptoms")}
              </RTLEnabledText>
            </RTLEnabledText>
          }
        />
      }
    >
      <InfoText
        useTitleStyle="headline2"
        title={t("assessment.agree_question_text")}
        description={t("assessment.agree_question_description")}
      />
    </Info>
  )
}

const ChoiceButtons = ({
  agreeTitle,
  disagreeTitle,
  agreePress,
  disagreePress,
}) => {
  return (
    <View>
      <Button
        textStyle={styles.choiceTextStyle}
        buttonStyle={styles.choiceButtonsStyle}
        onPress={agreePress}
        title={agreeTitle}
        backgroundColor={Colors.white}
        textColor={Colors.black}
      />
      <View style={styles.disagreeButtonContainerStyle}>
        <Button
          textStyle={styles.choiceTextStyle}
          buttonStyle={styles.choiceButtonsStyle}
          onPress={disagreePress}
          title={disagreeTitle}
          backgroundColor={Colors.white}
          textColor={Colors.black}
        />
      </View>
    </View>
  )
}

/** @type {SurveyQuestion} */
const agreeQuestion = {
  option_key: QUESTION_KEY_AGREE,
  question_key: QUESTION_KEY_AGREE,
  question_text: "How old are you?",
  question_type: "TEXT",
  required: false,
  screen_type: SCREEN_TYPE_RADIO,
}

/** @type {SurveyOption} */
const agreeOption = {
  key: QUESTION_KEY_AGREE,
  values: [
    {
      label: "< 18",
      value: "0",
    },
    {
      label: "19-29",
      value: "1",
    },
    {
      label: "30-39",
      value: "2",
    },
    {
      label: "40-49",
      value: "3",
    },
    {
      label: "50-59",
      value: "4",
    },
    {
      label: "60-69",
      value: "5",
    },
    {
      label: "70-79",
      value: "6",
    },
    {
      label: "80+",
      value: "7",
    },
    {
      label: "Choose not to answer",
      value: "8",
    },
  ],
}

const styles = StyleSheet.create({
  choiceTextStyle: {
    textAlign: "left",
    paddingHorizontal: 30,
  },
  choiceButtonsStyle: {
    borderWidth: 1,
    borderColor: Colors.steelGray,
  },
  disagreeButtonContainerStyle: {
    paddingTop: 10,
  },
  boldText: {
    fontWeight: "bold",
  },
  regularText: {
    fontWeight: "normal",
  },
})
