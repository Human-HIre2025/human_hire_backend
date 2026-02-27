const Client = require('../models/clientModel');
const { storeOnCloudinary, validateImage, deleteFromCloudinary } = require('../utils/imageUtils');

// Get all clients
exports.getClients = async (req, res) => {
    try {
        const clients = await Client.find();
        res.status(200).json({
            success: true,
            data: clients
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server Error',
            error: error.message
        });
    }
};

// Get single client
exports.getClient = async (req, res) => {
    try {
        const client = await Client.findById(req.params.id);
        if (!client) {
            return res.status(404).json({
                success: false,
                message: 'Client not found'
            });
        }
        res.status(200).json({
            success: true,
            data: client
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server Error',
            error: error.message
        });
    }
};

// Create client
exports.createClient = async (req, res) => {
    try {
        const { clientName } = req.body;
        let logoPath = '';

        if (req.file) {
            validateImage(req.file);
            logoPath = await storeOnCloudinary(req.file);
        }

        const client = new Client({
            clientName,
            logo: logoPath
        });

        await client.save();
        res.status(201).json({
            success: true,
            data: client
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: 'Validation Error',
            error: error.message
        });
    }
};

// Update client
exports.updateClient = async (req, res) => {
    try {
        const { clientName } = req.body;
        const client = await Client.findById(req.params.id);

        if (!client) {
            return res.status(404).json({
                success: false,
                message: 'Client not found'
            });
        }

        // Store old logo URL for potential cleanup
        const oldLogoUrl = client.logo;

        if (req.file) {
            validateImage(req.file);
            const logoPath = await storeOnCloudinary(req.file);
            client.logo = logoPath;

            // Delete old logo from Cloudinary if it exists and is different from new one
            if (oldLogoUrl && oldLogoUrl !== logoPath) {
                try {
                    await deleteFromCloudinary(oldLogoUrl);
                } catch (deleteError) {
                    console.error('Error deleting old logo from Cloudinary:', deleteError);
                    // Continue with the update even if image deletion fails
                }
            }
        }

        client.clientName = clientName || client.clientName;

        await client.save();
        res.status(200).json({
            success: true,
            data: client
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: 'Validation Error',
            error: error.message
        });
    }
};

// Delete client
exports.deleteClient = async (req, res) => {
    try {
        const client = await Client.findById(req.params.id);
        if (!client) {
            return res.status(404).json({
                success: false,
                message: 'Client not found'
            });
        }

        // Delete logo from Cloudinary if it exists
        if (client.logo) {
            try {
                await deleteFromCloudinary(client.logo);
            } catch (deleteError) {
                console.error('Error deleting logo from Cloudinary:', deleteError);
                // Continue with client deletion even if logo deletion fails
            }
        }

        await client.deleteOne();
        res.status(200).json({
            success: true,
            message: 'Client deleted successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server Error',
            error: error.message
        });
    }
};