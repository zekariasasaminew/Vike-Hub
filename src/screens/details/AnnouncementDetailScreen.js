import React, { useState, useEffect, useMemo } from "react";
import {
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  View,
  TouchableOpacity,
  Linking,
  Alert,
  Share,
  Dimensions,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";
import { useApp } from "../../contexts/AppContext";
import { theme } from "../../styles/theme";

const { width } = Dimensions.get("window");

const AnnouncementDetailScreen = ({ route, navigation }) => {
  const { announcement } = route.params;
  // const { theme: themeApp } = useApp();

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleLinkPress = async (url) => {
    try {
      const supported = await Linking.canOpenURL(url);
      if (supported) {
        await Linking.openURL(url);
      } else {
        Alert.alert("Error", "Cannot open this link");
      }
    } catch (error) {
      Alert.alert("Error", "Cannot open this link");
    }
  };

  const styles = useMemo(() => createStyles(), []);

  return (
    <SafeAreaView
      style={[commonStyles.safeArea, { backgroundColor: "#FFFFFF" }]}
    >
      {/* <StatusBar style={themeApp === "dark" ? "light" : "dark"} /> */}

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <MaterialIcons name="arrow-back" size={24} color={"#0F172A"} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: "#0F172A" }]}>
          Announcement
        </Text>
        <TouchableOpacity style={styles.shareButton}>
          <MaterialIcons name="share" size={24} color={"#0F172A"} />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Author Info */}
        <View
          style={[
            styles.authorSection,
            {
              backgroundColor: "#F8FAFC",
              borderColor: theme.colors.border,
            },
          ]}
        >
          <View style={styles.authorContainer}>
            <View style={[styles.authorAvatar, { backgroundColor: "#0F172A" }]}>
              <Text style={styles.authorAvatarText}>
                {(
                  announcement.profiles?.name || "Office of Student Life"
                ).charAt(0)}
              </Text>
            </View>
            <View style={styles.authorInfo}>
              <View style={styles.authorNameContainer}>
                <Text style={[styles.authorName, { color: "#0F172A" }]}>
                  {announcement.profiles?.name || "Office of Student Life"}
                </Text>
                <View
                  style={[styles.verifiedBadge, { backgroundColor: "#0F172A" }]}
                >
                  <MaterialIcons name="verified" size={14} color="white" />
                </View>
              </View>
              <Text style={[styles.authorTitle, { color: "#475569" }]}>
                {announcement.profiles?.title || "Student Life Administration"}
              </Text>
            </View>
          </View>
          <Text style={[styles.publishDate, { color: "#64748B" }]}>
            {formatDate(announcement.created_at)}
          </Text>
        </View>

        {/* Title */}
        <Text style={[styles.title, { color: "#0F172A" }]}>
          {announcement.title}
        </Text>

        {/* Tags */}
        {announcement.tags && announcement.tags.length > 0 && (
          <View style={styles.tagsContainer}>
            {announcement.tags.map((tag, index) => (
              <View
                key={index}
                style={[
                  styles.tag,
                  {
                    backgroundColor: "#0F172A" + "15",
                    borderColor: "#0F172A" + "30",
                  },
                ]}
              >
                <Text style={[styles.tagText, { color: "#0F172A" }]}>
                  {tag}
                </Text>
              </View>
            ))}
          </View>
        )}

        {/* Content */}
        <View
          style={[
            styles.contentSection,
            {
              backgroundColor: "#FFFFFF",
              borderColor: theme.colors.border,
              shadowColor: theme.colors.shadow,
            },
            ,
          ]}
        >
          <Text style={[styles.content, { color: "#475569" }]}>
            {announcement.content || announcement.description}
          </Text>
        </View>

        {/* Event Details (if applicable) */}
        {announcement.event_date && (
          <View
            style={[
              styles.eventSection,
              {
                backgroundColor: theme.colors.accent + "10",
                borderColor: theme.colors.accent + "30",
              },
            ]}
          >
            <View style={styles.eventHeader}>
              <MaterialIcons
                name="event"
                size={24}
                color={theme.colors.accent}
              />
              <Text style={[styles.eventTitle, { color: theme.colors.accent }]}>
                Event Details
              </Text>
            </View>
            <View style={styles.eventDetails}>
              <View style={styles.eventDetailRow}>
                <MaterialIcons name="schedule" size={18} color={"#475569"} />
                <Text style={[styles.eventDetailText, { color: "#475569" }]}>
                  {formatDate(announcement.event_date)}
                </Text>
              </View>
              {announcement.event_location && (
                <View style={styles.eventDetailRow}>
                  <MaterialIcons
                    name="location-on"
                    size={18}
                    color={"#475569"}
                  />
                  <Text style={[styles.eventDetailText, { color: "#475569" }]}>
                    {announcement.event_location}
                  </Text>
                </View>
              )}
            </View>
          </View>
        )}

        {/* Links */}
        {announcement.links && announcement.links.length > 0 && (
          <View
            style={[
              styles.linksSection,
              {
                backgroundColor: "#FFFFFF",
                borderColor: theme.colors.border,
                shadowColor: theme.colors.shadow,
              },
              ,
            ]}
          >
            <View style={styles.linksSectionHeader}>
              <MaterialIcons
                name="link"
                size={20}
                color={theme.colors.secondary}
              />
              <Text style={[styles.linksSectionTitle, { color: "#0F172A" }]}>
                Related Links
              </Text>
            </View>
            {announcement.links.map((link, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.linkItem,
                  {
                    backgroundColor: "#F8FAFC",
                    borderColor: theme.colors.border,
                  },
                ]}
                onPress={() => handleLinkPress(link.url)}
              >
                <View style={styles.linkContent}>
                  <MaterialIcons
                    name="open-in-new"
                    size={18}
                    color={theme.colors.secondary}
                  />
                  <View style={styles.linkTextContainer}>
                    <Text
                      style={[
                        styles.linkTitle,
                        { color: theme.colors.secondary },
                      ]}
                    >
                      {link.title || link.url}
                    </Text>
                    {link.description && (
                      <Text
                        style={[styles.linkDescription, { color: "#475569" }]}
                      >
                        {link.description}
                      </Text>
                    )}
                  </View>
                </View>
                <MaterialIcons
                  name="chevron-right"
                  size={20}
                  color={"#64748B"}
                />
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* Attachments */}
        {announcement.attachments && announcement.attachments.length > 0 && (
          <View
            style={[
              styles.attachmentsSection,
              {
                backgroundColor: "#FFFFFF",
                borderColor: theme.colors.border,
                shadowColor: theme.colors.shadow,
              },
              ,
            ]}
          >
            <View style={styles.attachmentsSectionHeader}>
              <MaterialIcons
                name="attachment"
                size={20}
                color={theme.colors.warning}
              />
              <Text
                style={[styles.attachmentsSectionTitle, { color: "#0F172A" }]}
              >
                Attachments
              </Text>
            </View>
            {announcement.attachments.map((attachment, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.attachmentItem,
                  {
                    backgroundColor: "#F8FAFC",
                    borderColor: theme.colors.border,
                  },
                ]}
                onPress={() => handleLinkPress(attachment.url)}
              >
                <View style={styles.attachmentContent}>
                  <MaterialIcons
                    name="insert-drive-file"
                    size={24}
                    color={theme.colors.warning}
                  />
                  <View style={styles.attachmentTextContainer}>
                    <Text style={[styles.attachmentName, { color: "#0F172A" }]}>
                      {attachment.name}
                    </Text>
                    <Text style={[styles.attachmentSize, { color: "#475569" }]}>
                      {attachment.size || "Unknown size"}
                    </Text>
                  </View>
                </View>
                <MaterialIcons name="download" size={20} color={"#64748B"} />
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* Stats */}
        <View
          style={[
            styles.statsSection,
            {
              backgroundColor: "#F8FAFC",
              borderColor: theme.colors.border,
            },
          ]}
        >
          <View style={styles.statItem}>
            <MaterialIcons name="visibility" size={18} color={"#64748B"} />
            <Text style={[styles.statText, { color: "#64748B" }]}>
              {announcement.views || 0} views
            </Text>
          </View>
          <View style={styles.statItem}>
            <MaterialIcons name="schedule" size={18} color={"#64748B"} />
            <Text style={[styles.statText, { color: "#64748B" }]}>
              Published {new Date(announcement.created_at).toLocaleDateString()}
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const createStyles = (theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
    },
    contentContainer: {
      padding: 20,
      paddingBottom: 40,
    },
    header: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingHorizontal: 16,
      paddingVertical: 12,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
    },
    backButton: {
      padding: 8,
    },
    headerTitle: {
      fontSize: 18,
      fontWeight: "600",
    },
    shareButton: {
      padding: 8,
    },
    authorSection: {
      padding: 16,
      borderRadius: 16,
      borderWidth: 1,
      marginBottom: 24,
    },
    authorContainer: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 12,
    },
    authorAvatar: {
      width: 48,
      height: 48,
      borderRadius: 24,
      justifyContent: "center",
      alignItems: "center",
      marginRight: 12,
    },
    authorAvatarText: {
      color: "white",
      fontSize: 20,
      fontWeight: "700",
    },
    authorInfo: {
      flex: 1,
    },
    authorNameContainer: {
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
    },
    authorName: {
      fontSize: 16,
      fontWeight: "600",
    },
    verifiedBadge: {
      width: 20,
      height: 20,
      borderRadius: 10,
      justifyContent: "center",
      alignItems: "center",
    },
    authorTitle: {
      fontSize: 14,
      marginTop: 2,
    },
    publishDate: {
      fontSize: 14,
      fontWeight: "500",
    },
    title: {
      fontSize: 28,
      fontWeight: "800",
      lineHeight: 36,
      marginBottom: 20,
    },
    tagsContainer: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: 8,
      marginBottom: 24,
    },
    tag: {
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 10,
      borderWidth: 1,
    },
    tagText: {
      fontSize: 12,
      fontWeight: "600",
    },
    contentSection: {
      padding: 20,
      borderRadius: 16,
      borderWidth: 1,
      marginBottom: 24,
    },
    content: {
      fontSize: 16,
      lineHeight: 26,
    },
    eventSection: {
      padding: 16,
      borderRadius: 16,
      borderWidth: 2,
      marginBottom: 24,
    },
    eventHeader: {
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
      marginBottom: 16,
    },
    eventTitle: {
      fontSize: 18,
      fontWeight: "700",
    },
    eventDetails: {
      gap: 12,
    },
    eventDetailRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
    },
    eventDetailText: {
      fontSize: 15,
      fontWeight: "500",
    },
    linksSection: {
      padding: 16,
      borderRadius: 16,
      borderWidth: 1,
      marginBottom: 24,
    },
    linksSectionHeader: {
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
      marginBottom: 16,
    },
    linksSectionTitle: {
      fontSize: 16,
      fontWeight: "700",
    },
    linkItem: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      padding: 12,
      borderRadius: 12,
      borderWidth: 1,
      marginBottom: 8,
    },
    linkContent: {
      flexDirection: "row",
      alignItems: "center",
      flex: 1,
      gap: 12,
    },
    linkTextContainer: {
      flex: 1,
    },
    linkTitle: {
      fontSize: 14,
      fontWeight: "600",
    },
    linkDescription: {
      fontSize: 12,
      marginTop: 2,
    },
    attachmentsSection: {
      padding: 16,
      borderRadius: 16,
      borderWidth: 1,
      marginBottom: 24,
    },
    attachmentsSectionHeader: {
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
      marginBottom: 16,
    },
    attachmentsSectionTitle: {
      fontSize: 16,
      fontWeight: "700",
    },
    attachmentItem: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      padding: 12,
      borderRadius: 12,
      borderWidth: 1,
      marginBottom: 8,
    },
    attachmentContent: {
      flexDirection: "row",
      alignItems: "center",
      flex: 1,
      gap: 12,
    },
    attachmentTextContainer: {
      flex: 1,
    },
    attachmentName: {
      fontSize: 14,
      fontWeight: "600",
    },
    attachmentSize: {
      fontSize: 12,
      marginTop: 2,
    },
    statsSection: {
      flexDirection: "row",
      justifyContent: "space-around",
      padding: 16,
      borderRadius: 16,
      borderWidth: 1,
    },
    statItem: {
      flexDirection: "row",
      alignItems: "center",
      gap: 6,
    },
    statText: {
      fontSize: 14,
      fontWeight: "500",
    },
  });

export default AnnouncementDetailScreen;
