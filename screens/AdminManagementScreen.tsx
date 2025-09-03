import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Modal, Alert } from 'react-native';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import BottomNav from '../components/Admin/BottomNav';
import axios from 'axios';
import { API_CONFIG } from '../config/api';

interface AdminUser {
    _id: string;
    name: string;
    email: string;
    role: 'super_admin' | 'admin' | 'event_manager' | 'meal_coordinator';
    isActive: boolean;
    createdAt?: string;
}

const AdminManagementScreen = () => {
    const navigation = useNavigation();
    const [admins, setAdmins] = useState<AdminUser[]>([]);

    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [selectedAdmin, setSelectedAdmin] = useState<AdminUser | null>(null);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        role: '',
    });

    const availableRoles = ['Super Admin', 'Event Manager', 'Meal Coordinator'];

    const mapUiRoleToApi = (role: string) => {
        switch (role) {
            case 'Super Admin': return 'super_admin';
            case 'Event Manager': return 'event_manager';
            case 'Meal Coordinator': return 'meal_coordinator';
            default: return 'admin';
        }
    };

    const mapApiRoleToUi = (role: AdminUser['role']) => {
        switch (role) {
            case 'super_admin': return 'Super Admin';
            case 'event_manager': return 'Event Manager';
            case 'meal_coordinator': return 'Meal Coordinator';
            case 'admin': return 'Admin';
            default: return role;
        }
    };

    const roleToPermissions = (role: AdminUser['role']) => {
        if (role === 'super_admin') return ['Manage Events', 'Manage Meals', 'Manage Admins'];
        if (role === 'event_manager') return ['Manage Events'];
        if (role === 'meal_coordinator') return ['Manage Meals'];
        if (role === 'admin') return ['Manage Events', 'Manage Meals'];
        return [];
    };

    const fetchAdmins = async () => {
        try {
            const res = await axios.get(`${API_CONFIG.BASE_URL}/admins`);
            const list: AdminUser[] = res.data?.data?.admins || [];
            setAdmins(list);
        } catch (e: any) {
            Alert.alert('Error', e.response?.data?.message || 'Failed to load admins');
        }
    };

    useEffect(() => {
        fetchAdmins();
    }, []);

    const handleAddAdmin = async () => {
        if (formData.name.trim() && formData.email.trim() && formData.role) {
            try {
                await axios.post(`${API_CONFIG.BASE_URL}/admins`, {
                    name: formData.name.trim(),
                    email: formData.email.trim(),
                    role: mapUiRoleToApi(formData.role),
                });
                setShowAddModal(false);
                resetForm();
                fetchAdmins();
                Alert.alert('Success', 'Admin created. A default password was emailed.');
            } catch (e: any) {
                Alert.alert('Error', e.response?.data?.message || 'Failed to create admin');
            }
        }
    };

    const handleEditAdmin = async () => {
        if (selectedAdmin && formData.name.trim() && formData.role) {
            try {
                await axios.put(`${API_CONFIG.BASE_URL}/admins/${selectedAdmin._id}`, {
                    name: formData.name.trim(),
                    role: mapUiRoleToApi(formData.role),
                });
                setShowEditModal(false);
                setSelectedAdmin(null);
                resetForm();
                fetchAdmins();
            } catch (e: any) {
                Alert.alert('Error', e.response?.data?.message || 'Failed to update admin');
            }
        }
    };

    const handleDeleteAdmin = (adminId: string) => {
        Alert.alert(
            'Delete Admin',
            'Are you sure you want to delete this admin? This action cannot be undone.',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Delete', style: 'destructive', onPress: async () => {
                        try {
                            await axios.delete(`${API_CONFIG.BASE_URL}/admins/${adminId}`);
                            fetchAdmins();
                        } catch (e: any) {
                            Alert.alert('Error', e.response?.data?.message || 'Failed to delete admin');
                        }
                    }
                }
            ]
        );
    };

    const handleToggleStatus = async (adminId: string) => {
        try {
            const target = admins.find(a => a._id === adminId);
            if (!target) return;
            await axios.put(`${API_CONFIG.BASE_URL}/admins/${adminId}`, { isActive: !target.isActive });
            fetchAdmins();
        } catch (e: any) {
            Alert.alert('Error', e.response?.data?.message || 'Failed to update status');
        }
    };

    const resetForm = () => {
        setFormData({
            name: '',
            email: '',
            role: '',
        });
    };

    const openEditModal = (admin: AdminUser) => {
        setSelectedAdmin(admin);
        setFormData({
            name: admin.name,
            email: admin.email,
            role: mapApiRoleToUi(admin.role),
        });
        setShowEditModal(true);
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
                        <View key={admin._id} style={styles.adminCard}>
                            <View style={styles.adminInfo}>
                                <View style={styles.adminDetails}>
                                    <Text style={styles.adminName}>{admin.name}</Text>
                                    <Text style={styles.adminEmail}>{admin.email}</Text>
                                    <Text style={styles.adminRole}>{mapApiRoleToUi(admin.role)}</Text>
                                    {admin.createdAt ? (
                                        <Text style={styles.joinDate}>Joined {new Date(admin.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</Text>
                                    ) : null}
                                </View>
                            </View>

                            <View style={styles.adminActions}>
                                <TouchableOpacity
                                    style={[styles.statusButton, admin.isActive ? styles.activeButton : styles.inactiveButton]}
                                    onPress={() => handleToggleStatus(admin._id)}
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
                                        onPress={() => handleDeleteAdmin(admin._id)}
                                    >
                                        <MaterialIcons name="delete" size={20} color="#e74c3c" />
                                    </TouchableOpacity>
                                </View>
                            </View>

                            {/* Permissions */}
                            <View style={styles.permissionsSection}>
                                <Text style={styles.permissionsTitle}>Permissions:</Text>
                                <View style={styles.permissionsList}>
                                    {roleToPermissions(admin.role).map((permission, index) => (
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

                        {/* Permissions removed: assigned automatically by role */}

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

                        {/* Permissions removed: assigned automatically by role */}

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
