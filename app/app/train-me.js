import React, { useState } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { ArrowLeft, CheckCircle, XCircle, AlertTriangle, Mail, RefreshCw } from 'lucide-react-native';
import SafeAreaWrapper from '@/components/layouts/SafeAreaWrapper';
import Button from '@/components/ui/Button';
import Colors from '@/constants/colors';
import phishingExamples from '@/mocks/pishingExamples';

export default function TrainMeScreen() {
  const router = useRouter();
  const [currentExample, setCurrentExample] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [score, setScore] = useState({ correct: 0, total: 0 });
  const [showExplanation, setShowExplanation] = useState(false);

  const handleAnswer = (isPhishing) => {
    setSelectedAnswer(isPhishing);
    setShowExplanation(true);
    
    if (isPhishing === phishingExamples[currentExample].isPhishing) {
      setScore(prev => ({ ...prev, correct: prev.correct + 1 }));
    }
    
    setScore(prev => ({ ...prev, total: prev.total + 1 }));
  };

  const nextExample = () => {
    if (currentExample < phishingExamples.length - 1) {
      setCurrentExample(prev => prev + 1);
      setSelectedAnswer(null);
      setShowExplanation(false);
    } else {
      // End of examples
      Alert.alert(
        "Training Complete",
        `You scored ${score.correct} out of ${score.total}`,
        [
          { 
            text: "Try Again", 
            onPress: resetTraining 
          },
          { 
            text: "Back to Home", 
            onPress: () => router.back() 
          }
        ]
      );
    }
  };

  const resetTraining = () => {
    setCurrentExample(0);
    setSelectedAnswer(null);
    setShowExplanation(false);
    setScore({ correct: 0, total: 0 });
  };

  const example = phishingExamples[currentExample];

  return (
    <SafeAreaWrapper>
      <Stack.Screen 
        options={{
          title: 'Phishing Training',
          headerLeft: () => (
            <TouchableOpacity 
              onPress={() => router.back()}
              style={styles.backButton}
            >
              <ArrowLeft size={24} color={Colors.text} />
            </TouchableOpacity>
          ),
        }} 
      />
      
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Is this a phishing attempt?</Text>
          <Text style={styles.subtitle}>
            Analyze the email below and decide if it's legitimate or a phishing attempt.
          </Text>
          
          <View style={styles.scoreContainer}>
            <Text style={styles.scoreText}>Score: {score.correct}/{score.total}</Text>
            <TouchableOpacity style={styles.resetButton} onPress={resetTraining}>
              <RefreshCw size={16} color={Colors.primary} />
              <Text style={styles.resetText}>Reset</Text>
            </TouchableOpacity>
          </View>
        </View>
        
        <ScrollView style={styles.emailContainer}>
          <View style={styles.emailHeader}>
            <Mail size={20} color={Colors.darkGray} style={styles.emailIcon} />
            <View style={styles.emailDetails}>
              <Text style={styles.emailSender}>From: {example.sender}</Text>
              <Text style={styles.emailSubject}>Subject: {example.subject}</Text>
            </View>
          </View>
          
          <View style={styles.emailBody}>
            <Text style={styles.emailContent}>{example.content}</Text>
          </View>
        </ScrollView>
        
        {!showExplanation ? (
          <View style={styles.actionButtons}>
            <TouchableOpacity 
              style={[styles.actionButton, styles.legitimateButton]}
              onPress={() => handleAnswer(false)}
            >
              <CheckCircle size={24} color={Colors.success} />
              <Text style={styles.actionButtonText}>Legitimate</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.actionButton, styles.phishingButton]}
              onPress={() => handleAnswer(true)}
            >
              <AlertTriangle size={24} color={Colors.error} />
              <Text style={styles.actionButtonText}>Phishing</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.explanationContainer}>
            <View style={[
              styles.resultBanner,
              selectedAnswer === example.isPhishing ? styles.correctBanner : styles.incorrectBanner
            ]}>
              {selectedAnswer === example.isPhishing ? (
                <View style={styles.resultContent}>
                  <CheckCircle size={20} color={Colors.success} />
                  <Text style={styles.resultText}>Correct!</Text>
                </View>
              ) : (
                <View style={styles.resultContent}>
                  <XCircle size={20} color={Colors.error} />
                  <Text style={styles.resultText}>Incorrect</Text>
                </View>
              )}
            </View>
            
            <Text style={styles.explanationTitle}>
              This is {example.isPhishing ? 'a phishing attempt' : 'legitimate'}
            </Text>
            <Text style={styles.explanationText}>{example.explanation}</Text>
            
            <Button
              title={currentExample < phishingExamples.length - 1 ? "Next Example" : "Finish Training"}
              onPress={nextExample}
              style={styles.nextButton}
            />
          </View>
        )}
      </View>
    </SafeAreaWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  backButton: {
    marginLeft: 8,
  },
  header: {
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.darkGray,
    marginBottom: 16,
  },
  scoreContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  scoreText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
  },
  resetButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  resetText: {
    fontSize: 14,
    color: Colors.primary,
    marginLeft: 4,
    fontWeight: '500',
  },
  emailContainer: {
    flex: 1,
    backgroundColor: Colors.card,
    borderRadius: 12,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  emailHeader: {
    flexDirection: 'row',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  emailIcon: {
    marginRight: 12,
  },
  emailDetails: {
    flex: 1,
  },
  emailSender: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.text,
    marginBottom: 4,
  },
  emailSubject: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
  },
  emailBody: {
    padding: 16,
  },
  emailContent: {
    fontSize: 15,
    color: Colors.text,
    lineHeight: 22,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    marginHorizontal: 6,
  },
  legitimateButton: {
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.3)',
  },
  phishingButton: {
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.3)',
  },
  actionButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
    marginLeft: 8,
  },
  explanationContainer: {
    backgroundColor: Colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  resultBanner: {
    padding: 10,
    borderRadius: 8,
    marginBottom: 12,
  },
  correctBanner: {
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
  },
  incorrectBanner: {
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
  },
  resultContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  resultText: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  explanationTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 8,
  },
  explanationText: {
    fontSize: 14,
    color: Colors.darkGray,
    lineHeight: 20,
    marginBottom: 16,
  },
  nextButton: {
    marginTop: 8,
  },
});