import { defineStore } from "pinia";
import { computed, ref } from "vue";

export type UserState = {
    user: SpotifyUser | null
}

export interface SpotifyUser {
    display_name: string;
    external_urls: {
        spotify: string;
    };
    href: string;
    id: string;
    images: any[];
    type: string;
    uri: string;
    followers: {
        href: string | null;
        total: number;
    };
    country: string;
    product: string;
    explicit_content: {
        filter_enabled: boolean;
        filter_locked: boolean;
    };
    email: string;
}

export const useAuthStore = defineStore("authStore", () => {
    const user = ref<SpotifyUser | null>(null);

    const getUser = computed(() => user.value);
    
    const setUser = (newUser: SpotifyUser | null) => {
        user.value = newUser;
    }

    const initUser = () => {
        if (process.client && localStorage.getItem('user')) {
            user.value = JSON.parse(localStorage.getItem('user') as string);
        }
    }

    const saveUser = () => {
        if (process.client) {
            localStorage.setItem('user', JSON.stringify(user.value));
        }
    }

    return {
        getUser,
        setUser,
        initUser,
        saveUser
    }
});