---
title: 'ARAMAS: A Gamified Terminal Simulator for Learning Linux and Bioinformatics'
tags:
  - Linux
  - Bioinformatics
  - Education
  - Gamification
  - React
authors:
  - name: Fabiano B. Menegidio
    orcid: 0000-0002-3558-8121
    affiliation: 1
affiliations:
  - name: Laboratório de Bioinformática e Ciências Ômicas (LaBiOmicS), Universidade de Mogi das Cruzes, Brazil
    index: 1
date: 25 April 2026
bibliography: paper.bib
---

# Summary

`ARAMAS` (Ambiente Remoto para o Aprendizado e Manipulação de Arquivos e Sistemas) is an open-source, web-based platform designed to teach Linux and Bioinformatics through a gamified, immersive experience. Built with React 19 and XTerm.js, it provides a faithful simulation of a Unix-like environment, including a Virtual File System (VFS), command piping, and a suite of specialized bioinformatics tools. The platform guides students through structured missions, rewarding progress with experience points (XP) and ranks, thereby reducing the entry barrier for complex command-line workflows.

# Statement of Need

Modern bioinformatics relies heavily on command-line proficiency. However, the initial learning curve for the Linux terminal can be steep for students from life sciences backgrounds. Existing educational resources often fall into two categories: static tutorials that lack interactivity, or full virtual machines that require complex setup and resources.

`ARAMAS` fills this gap by offering a zero-install, lightweight simulation that runs entirely in the browser. Unlike generic terminal simulators, `ARAMAS` is specifically tailored for bioinformatics, simulating the behavior of industry-standard tools like `samtools`, `bwa`, and `bcftools`. The integrated gamification engine provides immediate feedback and clear learning paths, which has been shown to increase student engagement and retention in technical subjects [@Deterding2011].

# Implementation

The software is implemented as a single-page application (SPA) using React and TypeScript. Key architectural components include:

- **Terminal Engine:** A custom-built interpreter that handles command parsing, piping, and execution.
- **Virtual File System (VFS):** An in-memory representation of a Linux-compliant directory structure, supporting standard operations and permissions.
- **Quest Manager:** A state-driven system that tracks user progress, validates mission objectives, and manages the XP/Rank progression.
- **Bio-Command Suite:** A collection of specialized modules that mimic the behavior and output of essential genomic analysis tools.

# Comparison to Other Software

While platforms like Codecademy or Exercism offer interactive terminal exercises, they are often proprietary or generalized. `ARAMAS` is unique in its focus on the bioinformatics domain and its offline-first capability through browser persistence. Compared to full-scale emulators like WebVM, `ARAMAS` is significantly faster and more accessible for introductory educational purposes, as it does not require a complete operating system image to function.

# Acknowledgements

The authors acknowledge the support of the Universidade de Mogi das Cruzes (UMC) and the contributors of the XTerm.js project.

# References
