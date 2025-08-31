import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Modal, Alert, Image } from 'react-native';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import BottomNav from '../components/Admin/BottomNav';

interface AdminUser {
    id: string;
    name: string;
    email: string;
    role: string;
    avatar: string;
    joinDate: string;
    permissions: string[];
    isActive: boolean;
}

const AdminManagementScreen = () => {
    const navigation = useNavigation();
    const [admins, setAdmins] = useState<AdminUser[]>([
        {
            id: '1',
            name: 'Gloria Admin',
            email: 'gloria.admin@lunel.com',
            role: 'Super Admin',
            avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
            joinDate: 'January 2024',
            permissions: ['Manage Events', 'Manage Meals', 'Manage Admins'],
            isActive: true
        },
        {
            id: '2',
            name: 'John Manager',
            email: 'john.manager@lunel.com',
            role: 'Event Manager',
            avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
            joinDate: 'February 2024',
            permissions: ['Manage Events', 'Manage Meals'],
            isActive: true
        },
        {
            id: '3',
            name: 'Sarah Coordinator',
            email: 'sarah.coordinator@lunel.com',
            role: 'Meal Coordinator',
            avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400',
            joinDate: 'March 2024',
            permissions: ['Manage Meals'],
            isActive: false
        }
    ]);

    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [selectedAdmin, setSelectedAdmin] = useState<AdminUser | null>(null);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        role: '',
        permissions: [] as string[]
    });

    const availableRoles = ['Super Admin', 'Event Manager', 'Meal Coordinator'];
    const availablePermissions = ['Manage Events', 'Manage Meals', 'Manage Admins'];

    const handleAddAdmin = () => {
        if (formData.name.trim() && formData.email.trim() && formData.role) {
            const newAdmin: AdminUser = {
                id: Date.now().toString(),
                name: formData.name.trim(),
                email: formData.email.trim(),
                role: formData.role,
                avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400',
                joinDate: new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
                permissions: formData.permissions,
                isActive: true
            };
            setAdmins(prev => [...prev, newAdmin]);
            setShowAddModal(false);
            resetForm();
        }
    };

    const handleEditAdmin = () => {
        if (selectedAdmin && formData.name.trim() && formData.email.trim() && formData.role) {
            setAdmins(prev => prev.map(admin =>
                admin.id === selectedAdmin.id
                    ? { ...admin, name: formData.name.trim(), email: formData.email.trim(), role: formData.role, permissions: formData.permissions }
                    : admin
            ));
            setShowEditModal(false);
            setSelectedAdmin(null);
            resetForm();
        }
    };

    const handleDeleteAdmin = (adminId: string) => {
        Alert.alert(
            'Delete Admin',
            'Are you sure you want to delete this admin? This action cannot be undone.',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Delete', style: 'destructive', onPress: () => {
                        setAdmins(prev => prev.filter(admin => admin.id !== adminId));
                    }
                }
            ]
        );
    };

    const handleToggleStatus = (adminId: string) => {
        setAdmins(prev => prev.map(admin =>
            admin.id === adminId
                ? { ...admin, isActive: !admin.isActive }
                : admin
        ));
    };

    const resetForm = () => {
        setFormData({
            name: '',
            email: '',
            role: '',
            permissions: []
        });
    };

    const openEditModal = (admin: AdminUser) => {
        setSelectedAdmin(admin);
        setFormData({
            name: admin.name,
            email: admin.email,
            role: admin.role,
            permissions: admin.permissions
        });
        setShowEditModal(true);
    };

    const togglePermission = (permission: string) => {
        setFormData(prev => ({
            ...prev,
            permissions: prev.permissions.includes(permission)
                ? prev.permissions.filter(p => p !== permission)
                : [...prev.permissions, permission]
        }));
    };

    return (
        <View style={styles.container}>
            <ScrollView style={styles.scrollView}>
                {/* Header */}
                <View style={styles.header}>
                    <TouchableOpacity
                        style={styles.backButton}
                        onPress={() => navigation.goBack()}
                    >
                        <MaterialIcons name="arrow-back" size={24} color="#666" />
                    </TouchableOpacity>
                    <View style={styles.headerContent}>
                        <Text style={styles.headerTitle}>Admin Management</Text>
                        <Text style={styles.headerSubtitle}>Manage admin users and permissions</Text>
                    </View>
                    <TouchableOpacity
                        style={styles.addButton}
                        onPress={() => setShowAddModal(true)}
                    >
                        <Ionicons name="add" size={24} color="#fff" />
                    </TouchableOpacity>
                </View>

                {/* Admin List */}
                <View style={styles.adminList}>
                    {admins.map((admin) => (
                        <View key={admin.id} style={styles.adminCard}>
                            <View style={styles.adminInfo}>
                                <Image source={{ uri: admin.avatar }} style={styles.adminAvatar} />
                                <View style={styles.adminDetails}>
                                    <Text style={styles.adminName}>{admin.name}</Text>
                                    <Text style={styles.adminEmail}>{admin.email}</Text>
                                    <Text style={styles.adminRole}>{admin.role}</Text>
                                    <Text style={styles.joinDate}>Joined {admin.joinDate}</Text>
                                </View>
                            </View>

                            <View style={styles.adminActions}>
                                <TouchableOpacity
                                    style={[styles.statusButton, admin.isActive ? styles.activeButton : styles.inactiveButton]}
                                    onPress={() => handleToggleStatus(admin.id)}
                                >
                                    <Text style={[styles.statusText, admin.isActive ? styles.activeText : styles.inactiveText]}>
                                        {admin.isActive ? 'Active' : 'Inactive'}
                                    </Text>
                                </TouchableOpacity>

                                <View style={styles.actionButtons}>
                                    <TouchableOpacity
                                        style={styles.editButton}
                                        onPress={() => openEditModal(admin)}
                                    >
                                        <MaterialIcons name="edit" size={20} color="#5b1ab2" />
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        style={styles.deleteButton}
                                        onPress={() => handleDeleteAdmin(admin.id)}
                                    >
                                        <MaterialIcons name="delete" size={20} color="#e74c3c" />
                                    </TouchableOpacity>
                                </View>
                            </View>

                            {/* Permissions */}
                            <View style={styles.permissionsSection}>
                                <Text style={styles.permissionsTitle}>Permissions:</Text>
                                <View style={styles.permissionsList}>
                                    {admin.permissions.map((permission, index) => (
                                        <View key={index} style={styles.permissionTag}>
                                            <Text style={styles.permissionText}>{permission}</Text>
                                        </View>
                                    ))}
                                </View>
                            </View>
                        </View>
                    ))}
                </View>
            </ScrollView>

            {/* Add Admin Modal */}
            <Modal
                visible={showAddModal}
                transparent={true}
                animationType="fade"
                onRequestClose={() => setShowAddModal(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>Add New Admin</Text>
                            <TouchableOpacity onPress={() => setShowAddModal(false)}>
                                <MaterialIcons name="close" size={24} color="#666" />
                            </TouchableOpacity>
                        </View>

                        <TextInput
                            style={styles.input}
                            placeholder="Admin Name"
                            value={formData.name}
                            onChangeText={(text) => setFormData(prev => ({ ...prev, name: text }))}
                        />

                        <TextInput
                            style={styles.input}
                            placeholder="Email Address"
                            value={formData.email}
                            onChangeText={(text) => setFormData(prev => ({ ...prev, email: text }))}
                            keyboardType="email-address"
                        />

                        <Text style={styles.label}>Role:</Text>
                        <View style={styles.roleContainer}>
                            {availableRoles.map((role) => (
                                <TouchableOpacity
                                    key={role}
                                    style={[
                                        styles.roleOption,
                                        formData.role === role && styles.selectedRole
                                    ]}
                                    onPress={() => setFormData(prev => ({ ...prev, role }))}
                                >
                                    <Text style={[
                                        styles.roleText,
                                        formData.role === role && styles.selectedRoleText
                                    ]}>
                                        {role}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>

                        <Text style={styles.label}>Permissions:</Text>
                        <View style={styles.permissionsContainer}>
                            {availablePermissions.map((permission) => (
                                <TouchableOpacity
                                    key={permission}
                                    style={[
                                        styles.permissionOption,
                                        formData.permissions.includes(permission) && styles.selectedPermission
                                    ]}
                                    onPress={() => togglePermission(permission)}
                                >
                                    <Text style={[
                                        styles.permissionOptionText,
                                        formData.permissions.includes(permission) && styles.selectedPermissionText
                                    ]}>
                                        {permission}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>

                        <View style={styles.modalButtons}>
                            <TouchableOpacity
                                style={[styles.modalButton, styles.cancelButton]}
                                onPress={() => {
                                    setShowAddModal(false);
                                    resetForm();
                                }}
                            >
                                <Text style={styles.cancelButtonText}>Cancel</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.modalButton, styles.saveButton]}
                                onPress={handleAddAdmin}
                            >
                                <Text style={styles.saveButtonText}>Add Admin</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>

            {/* Edit Admin Modal */}
            <Modal
                visible={showEditModal}
                transparent={true}
                animationType="fade"
                onRequestClose={() => setShowEditModal(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>Edit Admin</Text>
                            <TouchableOpacity onPress={() => setShowEditModal(false)}>
                                <MaterialIcons name="close" size={24} color="#666" />
                            </TouchableOpacity>
                        </View>

                        <TextInput
                            style={styles.input}
                            placeholder="Admin Name"
                            value={formData.name}
                            onChangeText={(text) => setFormData(prev => ({ ...prev, name: text }))}
                        />

                        <TextInput
                            style={styles.input}
                            placeholder="Email Address"
                            value={formData.email}
                            onChangeText={(text) => setFormData(prev => ({ ...prev, email: text }))}
                            keyboardType="email-address"
                        />

                        <Text style={styles.label}>Role:</Text>
                        <View style={styles.roleContainer}>
                            {availableRoles.map((role) => (
                                <TouchableOpacity
                                    key={role}
                                    style={[
                                        styles.roleOption,
                                        formData.role === role && styles.selectedRole
                                    ]}
                                    onPress={() => setFormData(prev => ({ ...prev, role }))}
                                >
                                    <Text style={[
                                        styles.roleText,
                                        formData.role === role && styles.selectedRoleText
                                    ]}>
                                        {role}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>

                        <Text style={styles.label}>Permissions:</Text>
                        <View style={styles.permissionsContainer}>
                            {availablePermissions.map((permission) => (
                                <TouchableOpacity
                                    key={permission}
                                    style={[
                                        styles.permissionOption,
                                        formData.permissions.includes(permission) && styles.selectedPermission
                                    ]}
                                    onPress={() => togglePermission(permission)}
                                >
                                    <Text style={[
                                        styles.permissionOptionText,
                                        formData.permissions.includes(permission) && styles.selectedPermissionText
                                    ]}>
                                        {permission}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>

                        <View style={styles.modalButtons}>
                            <TouchableOpacity
                                style={[styles.modalButton, styles.cancelButton]}
                                onPress={() => {
                                    setShowEditModal(false);
                                    setSelectedAdmin(null);
                                    resetForm();
                                }}
                            >
                                <Text style={styles.cancelButtonText}>Cancel</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.modalButton, styles.saveButton]}
                                onPress={handleEditAdmin}
                            >
                                <Text style={styles.saveButtonText}>Update Admin</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>

            <BottomNav activeTab="Profile" />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8f8f8',
    },
    scrollView: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 20,
        paddingTop: 40,
        gap:12,
        backgroundColor: 'white',
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    backButton: {
        padding: 8,
        marginRight: 10,
    },
    headerContent: {
        flex: 1,
        alignItems: 'center',
        marginTop:16,
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: '700',
        color: '#5b1ab2',
        marginBottom: 4,
        textAlign: 'center',
    },
    headerSubtitle: {
        fontSize: 14,
        color: '#666',
        textAlign: 'center',
    },
    addButton: {
        backgroundColor: '#f96c3d',
        width: 48,
        height: 48,
        borderRadius: 24,
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 2,
    },
    adminList: {
        padding: 20,
    },
    adminCard: {
        backgroundColor: 'white',
        borderRadius: 16,
        padding: 20,
        marginBottom: 16,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
    },
    adminInfo: {
        flexDirection: 'row',
        marginBottom: 16,
    },
    adminAvatar: {
        width: 60,
        height: 60,
        borderRadius: 30,
        marginRight: 16,
    },
    adminDetails: {
        flex: 1,
    },
    adminName: {
        fontSize: 18,
        fontWeight: '600',
        color: '#333',
        marginBottom: 4,
    },
    adminEmail: {
        fontSize: 14,
        color: '#666',
        marginBottom: 4,
    },
    adminRole: {
        fontSize: 14,
        color: '#5b1ab2',
        fontWeight: '500',
        marginBottom: 4,
    },
    joinDate: {
        fontSize: 12,
        color: '#999',
    },
    adminActions: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    statusButton: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 16,
    },
    activeButton: {
        backgroundColor: 'rgba(39, 174, 96, 0.1)',
    },
    inactiveButton: {
        backgroundColor: 'rgba(231, 76, 60, 0.1)',
    },
    statusText: {
        fontSize: 12,
        fontWeight: '500',
    },
    activeText: {
        color: '#27ae60',
    },
    inactiveText: {
        color: '#e74c3c',
    },
    actionButtons: {
        flexDirection: 'row',
        gap: 12,
    },
    editButton: {
        padding: 8,
        backgroundColor: 'rgba(91, 26, 178, 0.1)',
        borderRadius: 8,
    },
    deleteButton: {
        padding: 8,
        backgroundColor: 'rgba(231, 76, 60, 0.1)',
        borderRadius: 8,
    },
    permissionsSection: {
        borderTopWidth: 1,
        borderTopColor: '#f0f0f0',
        paddingTop: 16,
    },
    permissionsTitle: {
        fontSize: 14,
        fontWeight: '600',
        color: '#333',
        marginBottom: 12,
    },
    permissionsList: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },
    permissionTag: {
        backgroundColor: '#f0f8ff',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: '#e0e0e0',
    },
    permissionText: {
        fontSize: 12,
        color: '#5b1ab2',
        fontWeight: '500',
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    modalContent: {
        backgroundColor: 'white',
        borderRadius: 16,
        padding: 20,
        width: '100%',
        maxHeight: '90%',
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#333',
    },
    input: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 12,
        padding: 14,
        fontSize: 16,
        marginBottom: 16,
        backgroundColor: '#f9f9f9',
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        color: '#333',
        marginBottom: 12,
    },
    roleContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
        marginBottom: 20,
    },
    roleOption: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: '#ddd',
        backgroundColor: '#f9f9f9',
    },
    selectedRole: {
        backgroundColor: '#5b1ab2',
        borderColor: '#5b1ab2',
    },
    roleText: {
        fontSize: 14,
        color: '#666',
    },
    selectedRoleText: {
        color: '#fff',
        fontWeight: '500',
    },
    permissionsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
        marginBottom: 20,
    },
    permissionOption: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: '#ddd',
        backgroundColor: '#f9f9f9',
    },
    selectedPermission: {
        backgroundColor: '#f96c3d',
        borderColor: '#f96c3d',
    },
    permissionOptionText: {
        fontSize: 14,
        color: '#666',
    },
    selectedPermissionText: {
        color: '#fff',
        fontWeight: '500',
    },
    modalButtons: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 12,
    },
    modalButton: {
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 12,
        minWidth: 100,
        alignItems: 'center',
    },
    cancelButton: {
        backgroundColor: '#f0f0f0',
    },
    saveButton: {
        backgroundColor: '#f96c3d',
    },
    cancelButtonText: {
        color: '#666',
        fontWeight: '600',
        fontSize: 15,
    },
    saveButtonText: {
        color: '#fff',
        fontWeight: '600',
        fontSize: 15,
    },
});

export default AdminManagementScreen;
