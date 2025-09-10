import { supabase } from "./client";

export const profileApi = {
  // Get profile by ID
  getProfileById: async (id) => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", id)
        .single();

      return { data, error: error?.message || null };
    } catch (err) {
      return {
        data: null,
        error: "An unexpected error occurred getting profile",
      };
    }
  },
};

export const announcementApi = {
  // Get all announcements with pagination
  getAnnouncements: async (page = 1, pageSize = 10) => {
    try {
      const from = (page - 1) * pageSize;
      const to = from + pageSize - 1;

      const { data, error, count } = await supabase
        .from("announcements")
        .select(
          `
          *,
          profiles:created_by (
            name,
            email
          )
        `,
          { count: "exact" }
        )
        .order("created_at", { ascending: false })
        .range(from, to);

      if (error) {
        return {
          data: [],
          total: 0,
          page,
          pageSize,
          hasMore: false,
        };
      }

      return {
        data: data || [],
        total: count || 0,
        page,
        pageSize,
        hasMore: (count || 0) > to + 1,
      };
    } catch (err) {
      return {
        data: [],
        total: 0,
        page,
        pageSize,
        hasMore: false,
      };
    }
  },

  // Create announcement
  createAnnouncement: async (announcement) => {
    try {
      const { data, error } = await supabase
        .from("announcements")
        .insert({
          ...announcement,
          created_by: "00000000-0000-0000-0000-000000000000", // Default system user
        })
        .select()
        .single();

      return { data, error: error?.message || null };
    } catch (err) {
      return {
        data: null,
        error: "An unexpected error occurred creating announcement",
      };
    }
  },

  // Update announcement (admin only)
  updateAnnouncement: async (id, updates) => {
    try {
      const { data, error } = await supabase
        .from("announcements")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

      return { data, error: error?.message || null };
    } catch (err) {
      return {
        data: null,
        error: "An unexpected error occurred updating announcement",
      };
    }
  },

  // Delete announcement (admin only)
  deleteAnnouncement: async (id) => {
    try {
      const { error } = await supabase
        .from("announcements")
        .delete()
        .eq("id", id);

      return { data: null, error: error?.message || null };
    } catch (err) {
      return {
        data: null,
        error: "An unexpected error occurred deleting announcement",
      };
    }
  },
};

export const organizationApi = {
  // Get all organizations with member count
  getOrganizations: async () => {
    try {
      const { data, error } = await supabase
        .from("student_organizations")
        .select(
          `
          *,
          organization_members (
            user_id
          )
        `
        )
        .order("name");

      if (error) return { data: null, error: error.message };

      const organizations =
        data?.map((org) => ({
          ...org,
          member_count: org.organization_members.length,
          user_is_member: false, // No auth, so always false
          organization_members: undefined, // Remove from response
        })) || [];

      return { data: organizations, error: null };
    } catch (err) {
      return {
        data: null,
        error: "An unexpected error occurred getting organizations",
      };
    }
  },

  // Get organization by ID
  getOrganizationById: async (id) => {
    try {
      const { data, error } = await supabase
        .from("student_organizations")
        .select(
          `
          *,
          organization_members (
            user_id
          )
        `
        )
        .eq("id", id)
        .single();

      if (error) return { data: null, error: error.message };

      const organization = {
        ...data,
        member_count: data.organization_members.length,
        user_is_member: false, // No auth, so always false
        organization_members: undefined, // Remove from response
      };

      return { data: organization, error: null };
    } catch (err) {
      return {
        data: null,
        error: "An unexpected error occurred getting organization",
      };
    }
  },

  // Create organization (admin only)
  createOrganization: async (organization) => {
    try {
      const { data, error } = await supabase
        .from("student_organizations")
        .insert(organization)
        .select()
        .single();

      return { data, error: error?.message || null };
    } catch (err) {
      return {
        data: null,
        error: "An unexpected error occurred creating organization",
      };
    }
  },
};

export const eventApi = {
  // Get all events with organization info and RSVP count
  getEvents: async (page = 1, pageSize = 10, organizationId) => {
    try {
      const from = (page - 1) * pageSize;
      const to = from + pageSize - 1;

      let query = supabase
        .from("events")
        .select(
          `
          *,
          student_organizations (
            name,
            logo_url
          ),
          event_rsvps (
            user_id
          )
        `,
          { count: "exact" }
        )
        .order("start_time", { ascending: true });

      if (organizationId) {
        query = query.eq("organization_id", organizationId);
      }

      const { data, error, count } = await query.range(from, to);

      if (error) {
        return {
          data: [],
          total: 0,
          page,
          pageSize,
          hasMore: false,
        };
      }

      const events =
        data?.map((event) => ({
          ...event,
          rsvp_count: event.event_rsvps.length,
          user_has_rsvped: false, // No auth, so always false
          event_rsvps: undefined, // Remove from response
        })) || [];

      return {
        data: events,
        total: count || 0,
        page,
        pageSize,
        hasMore: (count || 0) > to + 1,
      };
    } catch (err) {
      return {
        data: [],
        total: 0,
        page,
        pageSize,
        hasMore: false,
      };
    }
  },

  // Create event
  createEvent: async (event) => {
    try {
      const { data, error } = await supabase
        .from("events")
        .insert(event)
        .select()
        .single();

      return { data, error: error?.message || null };
    } catch (err) {
      return {
        data: null,
        error: "An unexpected error occurred creating event",
      };
    }
  },

  // Update event
  updateEvent: async (id, updates) => {
    try {
      const { data, error } = await supabase
        .from("events")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

      return { data, error: error?.message || null };
    } catch (err) {
      return {
        data: null,
        error: "An unexpected error occurred updating event",
      };
    }
  },

  // Delete event
  deleteEvent: async (id) => {
    try {
      const { error } = await supabase.from("events").delete().eq("id", id);

      return { data: null, error: error?.message || null };
    } catch (err) {
      return {
        data: null,
        error: "An unexpected error occurred deleting event",
      };
    }
  },
};

export const realtimeApi = {
  // Subscribe to announcements changes
  subscribeToAnnouncements: (callback) => {
    return supabase
      .channel("announcements")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "announcements" },
        callback
      )
      .subscribe();
  },

  // Subscribe to events changes
  subscribeToEvents: (callback) => {
    return supabase
      .channel("events")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "events" },
        callback
      )
      .subscribe();
  },

  // Subscribe to organization changes
  subscribeToOrganizations: (callback) => {
    return supabase
      .channel("organizations")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "student_organizations" },
        callback
      )
      .subscribe();
  },

  // Unsubscribe from channel
  unsubscribe: (channel) => {
    return supabase.removeChannel(channel);
  },
};
