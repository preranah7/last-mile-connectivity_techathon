import { useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';

export const useAuth = () => {
    const context = useContext(AuthContext);

    // Error if hook used outside AuthProvider
    if (!context) {
        throw new Error(
            'useAuth must be used within AuthProvider. ' +
            'Make sure your component is wrapped in <AuthProvider>.'
        );
    }

    return context;
};


export const useAuthWithRoles = () => {
    const context = useAuth();

    const hasRole = (role) => {
        if (!context.user || !context.user.roles) return false;
        return context.user.roles.includes(role);
    };

    const hasAnyRole = (roles) => {
        if (!context.user || !context.user.roles) return false;
        return roles.some((role) => context.user.roles.includes(role));
    };

    const hasAllRoles = (roles) => {
        if (!context.user || !context.user.roles) return false;
        return roles.every((role) => context.user.roles.includes(role));
    };

    const isKYCVerified = () => {
        if (!context.user) return false;
        return context.user.kycStatus === 'VERIFIED';
    };

    const isKYCInProgress = () => {
        if (!context.user) return false;
        return context.user.kycStatus === 'IN_PROGRESS';
    };

    const needsKYC = () => {
        if (!context.user) return false;
        return context.user.kycStatus === 'NOT_STARTED' ||
            context.user.kycStatus === 'IN_PROGRESS';
    };

    return {
        ...context,
        hasRole,
        hasAnyRole,
        hasAllRoles,
        isKYCVerified,
        isKYCInProgress,
        needsKYC,
    };
};