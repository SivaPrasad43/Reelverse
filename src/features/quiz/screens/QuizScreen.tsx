import { progressAPI } from "@/shared/api/progressAPI";
import { useAppSelector } from "@/shared/store";
import { commonStyles, theme } from "@/shared/styles";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

interface Question {
  id: string;
  question: string;
  options: string[];
  correctAnswer: string;
}

const mockQuestions: Question[] = [
  {
    id: "1",
    question: "What is React Native?",
    options: [
      "A web framework",
      "A mobile app development framework",
      "A database",
      "A programming language",
    ],
    correctAnswer: "A mobile app development framework",
  },
  {
    id: "2",
    question: "Which language is primarily used in React Native?",
    options: ["Python", "Java", "JavaScript/TypeScript", "Swift"],
    correctAnswer: "JavaScript/TypeScript",
  },
  {
    id: "3",
    question: "What does JSX stand for?",
    options: [
      "JavaScript XML",
      "Java Syntax Extension",
      "JavaScript eXtension",
      "Just Simple X-code",
    ],
    correctAnswer: "JavaScript XML",
  },
];

export default function QuizPage() {
  const { id, courseId } = useLocalSearchParams<{
    id: string;
    courseId: string;
  }>();
  const router = useRouter();
  const { user } = useAppSelector((state) => state.auth);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<{
    [key: string]: string;
  }>({});
  const [showResults, setShowResults] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleSelectAnswer = (answer: string) => {
    setSelectedAnswers({
      ...selectedAnswers,
      [mockQuestions[currentQuestion].id]: answer,
    });
  };

  const handleNext = () => {
    if (currentQuestion < mockQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      handleSubmit();
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const calculateScore = () => {
    let correct = 0;
    mockQuestions.forEach((q) => {
      if (selectedAnswers[q.id] === q.correctAnswer) {
        correct++;
      }
    });
    return Math.round((correct / mockQuestions.length) * 100);
  };

  const handleSubmit = async () => {
    const unanswered = mockQuestions.filter((q) => !selectedAnswers[q.id]);

    if (unanswered.length > 0) {
      Alert.alert(
        "Incomplete Quiz",
        `You have ${unanswered.length} unanswered question(s). Do you want to submit anyway?`,
        [
          { text: "Cancel", style: "cancel" },
          { text: "Submit", onPress: () => submitQuiz() },
        ]
      );
    } else {
      submitQuiz();
    }
  };

  const submitQuiz = async () => {
    setSubmitting(true);
    const score = calculateScore();

    if (user && courseId) {
      try {
        await progressAPI.submitQuizScore(user.id, courseId, id!, score);
      } catch (error) {
        console.error("Failed to submit quiz:", error);
      }
    }

    setShowResults(true);
    setSubmitting(false);
  };

  const handleRetry = () => {
    setCurrentQuestion(0);
    setSelectedAnswers({});
    setShowResults(false);
  };

  if (showResults) {
    const score = calculateScore();
    const passed = score >= 70;

    return (
      <View style={commonStyles.container}>
        <ScrollView
          contentContainerStyle={styles.resultsContainer}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.resultsIconContainer}>
            <Text style={styles.resultsIcon}>{passed ? "🎉" : "😔"}</Text>
          </View>
          <Text style={styles.resultsTitle}>
            {passed ? "Congratulations!" : "Keep Learning!"}
          </Text>
          <Text style={styles.resultsScore}>{score}%</Text>
          <Text style={styles.resultsText}>
            {passed
              ? "You passed the quiz! Great job!"
              : "You need 70% to pass. Try again!"}
          </Text>

          <View style={styles.resultsSummary}>
            <Text style={styles.summaryTitle}>Summary</Text>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Correct Answers:</Text>
              <Text style={styles.summaryValue}>
                {Math.round((score / 100) * mockQuestions.length)} /{" "}
                {mockQuestions.length}
              </Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Passing Score:</Text>
              <Text style={styles.summaryValue}>70%</Text>
            </View>
          </View>

          <TouchableOpacity
            style={[
              commonStyles.button,
              commonStyles.buttonPrimary,
              styles.button,
            ]}
            onPress={() => router.back()}
          >
            <Text style={styles.buttonText}>Back to Course</Text>
          </TouchableOpacity>

          {!passed && (
            <TouchableOpacity
              style={[commonStyles.button, commonStyles.buttonOutline]}
              onPress={handleRetry}
            >
              <Text style={styles.retryButtonText}>Try Again</Text>
            </TouchableOpacity>
          )}
        </ScrollView>
      </View>
    );
  }

  const question = mockQuestions[currentQuestion];
  const selectedAnswer = selectedAnswers[question.id];

  return (
    <View style={commonStyles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.closeButton}>✕</Text>
        </TouchableOpacity>
        <Text style={styles.progress}>
          Question {currentQuestion + 1} of {mockQuestions.length}
        </Text>
        <View style={styles.placeholder} />
      </View>

      <View style={styles.progressBar}>
        <View
          style={[
            styles.progressFill,
            {
              width: `${((currentQuestion + 1) / mockQuestions.length) * 100}%`,
            },
          ]}
        />
      </View>

      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.contentContainer}
      >
        <Text style={styles.question}>{question.question}</Text>

        <View style={styles.options}>
          {question.options.map((option, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.option,
                selectedAnswer === option && styles.optionSelected,
              ]}
              onPress={() => handleSelectAnswer(option)}
            >
              <View
                style={[
                  styles.optionRadio,
                  selectedAnswer === option && styles.optionRadioSelected,
                ]}
              >
                {selectedAnswer === option && (
                  <View style={styles.optionRadioInner} />
                )}
              </View>
              <Text
                style={[
                  styles.optionText,
                  selectedAnswer === option && styles.optionTextSelected,
                ]}
              >
                {option}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={[
            styles.navigationButton,
            currentQuestion === 0 && styles.navigationButtonDisabled,
          ]}
          onPress={handlePrevious}
          disabled={currentQuestion === 0}
        >
          <Text style={styles.navigationButtonText}>← Previous</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            commonStyles.button,
            commonStyles.buttonPrimary,
            styles.nextButton,
            !selectedAnswer && styles.nextButtonDisabled,
          ]}
          onPress={handleNext}
          disabled={!selectedAnswer || submitting}
        >
          <Text style={styles.nextButtonText}>
            {currentQuestion === mockQuestions.length - 1
              ? submitting
                ? "Submitting..."
                : "Submit"
              : "Next →"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: theme.spacing.md,
    paddingTop: theme.spacing.xl,
    backgroundColor: theme.colors.background.paper,
  },
  closeButton: {
    fontSize: 24,
    color: theme.colors.text.primary,
    width: 40,
  },
  progress: {
    fontSize: theme.typography.fontSize.base,
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.text.primary,
  },
  placeholder: {
    width: 40,
  },
  progressBar: {
    height: 4,
    backgroundColor: theme.colors.border,
  },
  progressFill: {
    height: "100%",
    backgroundColor: theme.colors.primary.main,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: theme.spacing.lg,
  },
  question: {
    fontSize: theme.typography.fontSize.xl,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.xl,
    lineHeight: 32,
  },
  options: {
    gap: theme.spacing.md,
  },
  option: {
    flexDirection: "row",
    alignItems: "center",
    padding: theme.spacing.md,
    backgroundColor: theme.colors.background.paper,
    borderRadius: theme.borderRadius.lg,
    borderWidth: 2,
    borderColor: theme.colors.border,
  },
  optionSelected: {
    borderColor: theme.colors.primary.main,
    backgroundColor: theme.colors.primary.light,
  },
  optionRadio: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: theme.colors.border,
    marginRight: theme.spacing.md,
    justifyContent: "center",
    alignItems: "center",
  },
  optionRadioSelected: {
    borderColor: theme.colors.primary.main,
  },
  optionRadioInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: theme.colors.primary.main,
  },
  optionText: {
    flex: 1,
    fontSize: theme.typography.fontSize.base,
    color: theme.colors.text.primary,
  },
  optionTextSelected: {
    fontWeight: theme.typography.fontWeight.semibold,
  },
  footer: {
    flexDirection: "row",
    padding: theme.spacing.md,
    backgroundColor: theme.colors.background.paper,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
    gap: theme.spacing.md,
  },
  navigationButton: {
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.lg,
    borderRadius: theme.borderRadius.md,
  },
  navigationButtonDisabled: {
    opacity: 0.3,
  },
  navigationButtonText: {
    fontSize: theme.typography.fontSize.base,
    color: theme.colors.primary.main,
    fontWeight: theme.typography.fontWeight.semibold,
  },
  nextButton: {
    flex: 1,
  },
  nextButtonDisabled: {
    opacity: 0.5,
  },
  nextButtonText: {
    color: theme.colors.primary.contrast,
    fontSize: theme.typography.fontSize.base,
    fontWeight: theme.typography.fontWeight.semibold,
  },
  resultsContainer: {
    flexGrow: 1,
    justifyContent: "center",
    padding: theme.spacing.xl,
  },
  resultsIconContainer: {
    alignItems: "center",
    marginBottom: theme.spacing.lg,
  },
  resultsIcon: {
    fontSize: 80,
  },
  resultsTitle: {
    fontSize: theme.typography.fontSize["3xl"],
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text.primary,
    textAlign: "center",
    marginBottom: theme.spacing.md,
  },
  resultsScore: {
    fontSize: 64,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.primary.main,
    textAlign: "center",
    marginBottom: theme.spacing.sm,
  },
  resultsText: {
    fontSize: theme.typography.fontSize.lg,
    color: theme.colors.text.secondary,
    textAlign: "center",
    marginBottom: theme.spacing.xl,
  },
  resultsSummary: {
    backgroundColor: theme.colors.background.paper,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.xl,
  },
  summaryTitle: {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.md,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: theme.spacing.sm,
  },
  summaryLabel: {
    fontSize: theme.typography.fontSize.base,
    color: theme.colors.text.secondary,
  },
  summaryValue: {
    fontSize: theme.typography.fontSize.base,
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.text.primary,
  },
  button: {
    marginBottom: theme.spacing.md,
  },
  buttonText: {
    color: theme.colors.primary.contrast,
    fontSize: theme.typography.fontSize.base,
    fontWeight: theme.typography.fontWeight.semibold,
  },
  retryButtonText: {
    color: theme.colors.primary.main,
    fontSize: theme.typography.fontSize.base,
    fontWeight: theme.typography.fontWeight.semibold,
  },
});
