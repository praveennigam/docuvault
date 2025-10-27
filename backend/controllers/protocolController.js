import Protocol from "../models/Protocol.js";

// Create protocol
export const createProtocol = async (req, res) => {
  try {
    const { name, description, steps, allDocuments, createdBy } = req.body;

    const protocol = new Protocol({
      name,
      description, // ✅ added
      steps: steps || [],
      allDocuments: allDocuments || [],
      createdBy,
      lastModifiedBy: createdBy,
    });

    await protocol.save();
    res.status(201).json(protocol);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get all protocols
export const getAllProtocols = async (req, res) => {
  try {
    const protocols = await Protocol.find();
    res.status(200).json(protocols);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get protocol by ID
export const getProtocolById = async (req, res) => {
  try {
    const protocol = await Protocol.findById(req.params.id);
    if (!protocol) return res.status(404).json({ message: "Protocol not found" });
    res.status(200).json(protocol);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update protocol
export const updateProtocol = async (req, res) => {
  try {
    const { name, description, allDocuments, lastModifiedBy } = req.body;

    const updated = await Protocol.findByIdAndUpdate(
      req.params.id,
      {
        name,
        description, // ✅ added
        allDocuments,
        lastModifiedBy: lastModifiedBy || "System",
      },
      { new: true }
    );

    if (!updated) return res.status(404).json({ message: "Protocol not found" });
    res.status(200).json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Delete protocol
export const deleteProtocol = async (req, res) => {
  try {
    const deleted = await Protocol.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Protocol not found" });
    res.status(200).json({ message: "Protocol deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Add description to step
export const addDescription = async (req, res) => {
  try {
    const { protocolId, stepIndex } = req.params;
    const { text, addedBy } = req.body;
    const protocol = await Protocol.findById(protocolId);
    if (!protocol) return res.status(404).json({ message: "Protocol not found" });

    protocol.steps[stepIndex].description.push({ text, addedBy });
    protocol.lastModifiedBy = addedBy || "System";

    await protocol.save();
    res.status(200).json(protocol);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Upload files for a step
export const uploadDocuments = async (req, res) => {
  try {
    const { protocolId, stepIndex } = req.params;
    const files = req.files;
    if (!files || !files.length)
      return res.status(400).json({ message: "No files uploaded" });

    const protocol = await Protocol.findById(protocolId);
    if (!protocol) return res.status(404).json({ message: "Protocol not found" });

    const idx = parseInt(stepIndex, 10);
    if (!protocol.steps[idx]) {
      protocol.steps[idx] = { title: `Step ${idx + 1}`, description: [], documents: [] };
    }

    files.forEach((f) => protocol.steps[idx].documents.push(f.filename));

    await protocol.save();
    res.status(200).json(protocol);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};
