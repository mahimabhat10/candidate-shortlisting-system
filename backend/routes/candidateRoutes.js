const express = require("express");

const router = express.Router();

const Candidate = require("../models/Candidate");


// ADD CANDIDATE
router.post("/candidates", async (req, res) => {

  try {

    const candidate = new Candidate(req.body);

    await candidate.save();

    res.json(candidate);

  } catch (error) {

    res.status(500).json({
      error: error.message
    });

  }

});


// GET ALL CANDIDATES
router.get("/candidates", async (req, res) => {

  try {

    const candidates = await Candidate.find();

    res.json(candidates);

  } catch (error) {

    res.status(500).json({
      error: error.message
    });

  }

});


// MATCH CANDIDATES
router.post("/match", async (req, res) => {

  try {

    const { requiredSkills, minExperience } = req.body;

    const candidates = await Candidate.find();

    const rankedCandidates = candidates.map(candidate => {

      const matchedSkills = candidate.skills.filter(skill =>
        requiredSkills.includes(skill)
      );

      const score =
        (matchedSkills.length / requiredSkills.length) * 100;

      return {
        ...candidate._doc,
        matchedSkills,
        matchScore: score
      };

    })

    .filter(candidate =>
      candidate.experience >= minExperience
    )

    .sort((a, b) =>
      b.matchScore - a.matchScore
    );

    res.json(rankedCandidates);

  } catch (error) {

    res.status(500).json({
      error: error.message
    });

  }

});


// AI SHORTLISTING
router.post("/ai/shortlist", async (req, res) => {

  try {

    const candidates = await Candidate.find();

    const shortlisted = candidates.map(candidate => {

      let score = 0;

      if (candidate.skills.includes("React")) score += 30;

      if (candidate.skills.includes("Node.js")) score += 30;

      if (candidate.skills.includes("MongoDB")) score += 30;

      score += candidate.experience * 2;

      return {
        name: candidate.name,
        skills: candidate.skills,
        experience: candidate.experience,
        score
      };

    }).sort((a, b) => b.score - a.score);

    res.json({
      success: true,
      message: "AI Shortlisting Completed",
      shortlisted
    });

  } catch (error) {

    res.status(500).json({
      error: error.message
    });

  }

});

module.exports = router;