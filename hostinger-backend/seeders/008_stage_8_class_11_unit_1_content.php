<?php

declare(strict_types=1);

return function (PDO $pdo): void {
    $now = date('Y-m-d H:i:s');
    $sourceReference = 'NCERT Class 11 Chemistry Unit 1, Some Basic Concepts of Chemistry';

    $classId = fetchId($pdo, "SELECT id FROM classes WHERE class_level = '11' LIMIT 1");
    if ($classId === null) {
        $pdo->prepare("INSERT INTO classes (class_level, display_name, status, created_at, updated_at) VALUES ('11', 'Class 11', 'active', ?, ?)")
            ->execute([$now, $now]);
        $classId = (int) $pdo->lastInsertId();
    }

    $subjectId = fetchId($pdo, "SELECT id FROM subjects WHERE class_id = ? AND subject_type = 'chemistry' LIMIT 1", [$classId]);
    if ($subjectId === null) {
        $pdo->prepare("INSERT INTO subjects (class_id, name, subject_type, status, created_at, updated_at) VALUES (?, 'Chemistry', 'chemistry', 'active', ?, ?)")
            ->execute([$classId, $now, $now]);
        $subjectId = (int) $pdo->lastInsertId();
    }

    $bookId = upsertBook($pdo, $classId, $subjectId, $now);
    $chapterId = upsertChapter($pdo, $bookId, $classId, $subjectId, $now);

    $topics = stage8Topics();
    foreach ($topics as $index => $topic) {
        $topicId = upsertTopic($pdo, $chapterId, $classId, $subjectId, $topic, $now);
        $topics[$index]['id'] = $topicId;
        upsertMistakePatterns($pdo, $classId, $subjectId, $chapterId, $topicId, $topic, $now);
    }

    $overviewResourceId = upsertLearningResource($pdo, [
        'uuid' => 'stage8-resource-class11-unit1-overview',
        'class_id' => $classId,
        'subject_id' => $subjectId,
        'chapter_id' => $chapterId,
        'topic_id' => null,
        'type' => 'explanation',
        'title' => 'Some Basic Concepts of Chemistry',
        'slug' => 'some-basic-concepts-of-chemistry',
        'description' => 'Class 11 Unit 1 learning pack for matter, measurement, mole concept, formula work, and stoichiometry.',
        'route_url' => '/resources/some-basic-concepts-of-chemistry',
        'content_json' => json_encode([
            'summary' => 'Original Chemlab explanations, memory cards, quick drills, concept map and lab links for Unit 1.',
            'source_policy' => 'NCERT-aligned source backbone. Do not copy textbook paragraphs into public pages.',
        ], JSON_UNESCAPED_SLASHES),
        'source_type' => 'CUSTOM',
        'source_reference' => $sourceReference,
        'status' => 'published',
        'quality_status' => 'needs_review',
        'why_useful' => 'This overview gives students one entry point for the foundational ideas needed before numerical chemistry.',
        'student_instructions' => 'Start with the Chemistry Scale Universe lab, then review memory cards and quick drills.',
        'student_level' => 'intermediate',
        'estimated_minutes' => 35,
    ], $now);

    $labResourceId = upsertLearningResource($pdo, [
        'uuid' => 'stage8-resource-chemistry-scale-universe',
        'class_id' => $classId,
        'subject_id' => $subjectId,
        'chapter_id' => $chapterId,
        'topic_id' => null,
        'type' => 'simulation',
        'title' => 'Chemistry Scale Universe',
        'slug' => 'basic-concepts-chemistry-universe',
        'description' => 'Explore matter, measurement, mole concept, and stoichiometry as a multi-zone Class 11 universe.',
        'route_url' => '/labs/basic-concepts-chemistry-universe',
        'content_json' => json_encode([
            'zones' => ['Matter World', 'Measurement Lab', 'Mole Portal', 'Stoichiometry Factory'],
            'preview_zones' => ['Chemical Laws Court', 'Formula Detective'],
        ], JSON_UNESCAPED_SLASHES),
        'source_type' => 'SIMULATION',
        'source_reference' => $sourceReference,
        'status' => 'published',
        'quality_status' => 'needs_review',
        'why_useful' => 'It turns abstract Unit 1 ideas into visible actions and safe numerical practice.',
        'student_instructions' => 'Complete the four playable zones and use checkpoints to catch mistakes.',
        'student_level' => 'intermediate',
        'estimated_minutes' => 22,
    ], $now);

    upsertLearningResource($pdo, [
        'uuid' => 'stage8-resource-unit1-concept-map',
        'class_id' => $classId,
        'subject_id' => $subjectId,
        'chapter_id' => $chapterId,
        'topic_id' => null,
        'type' => 'concept_map',
        'title' => 'Some Basic Concepts of Chemistry Map',
        'slug' => 'some-basic-concepts-of-chemistry-map',
        'description' => 'A concept map connecting matter, measurement, mole concept, formula work, and stoichiometry.',
        'route_url' => null,
        'content_json' => json_encode(['resource_id' => $overviewResourceId], JSON_UNESCAPED_SLASHES),
        'source_type' => 'CUSTOM',
        'source_reference' => $sourceReference,
        'status' => 'published',
        'quality_status' => 'needs_review',
        'why_useful' => 'Students can see how Unit 1 concepts support each other.',
        'student_instructions' => 'Use the map before revision or before asking Chem-Shastri for help.',
        'student_level' => 'intermediate',
        'estimated_minutes' => 8,
    ], $now);

    upsertConceptMap($pdo, $classId, $subjectId, $chapterId, $sourceReference, $now);
    upsertDecksAndCards($pdo, $classId, $subjectId, $chapterId, $overviewResourceId, $topics, $sourceReference, $now);
    upsertDrillsAndQuestions($pdo, $classId, $subjectId, $chapterId, $overviewResourceId, $topics, $sourceReference, $now);
    upsertTeacherQuizPacks($pdo, $sourceReference, $now);
    upsertSiteSettings($pdo, $now);

    echo "Stage 8 Class 11 Unit 1 content seeded. Overview resource {$overviewResourceId}, lab resource {$labResourceId}.\n";
};

function stage8Topics(): array
{
    return [
        topicSeed(1, 'Chemistry and its importance', 'chemistry-and-its-importance', 'beginner', 'See chemistry as the study of matter, change, and useful materials in everyday life.', 'Chemistry links medicines, materials, agriculture, fuels, food, and environmental decisions.', 'Chemistry is only memorising reactions.', 'Chemistry matters only inside a laboratory.'),
        topicSeed(2, 'Nature of matter', 'nature-of-matter', 'beginner', 'Understand that matter has mass, occupies space, and is made of particles.', 'Matter is particle-based, measurable, and changes form without disappearing.', 'Gases are not matter because they are invisible.', 'Particles inside solids stop moving.'),
        topicSeed(3, 'States of matter', 'states-of-matter', 'beginner', 'Compare solids, liquids, and gases using particle spacing and movement.', 'States depend on particle arrangement, attraction, and kinetic energy.', 'A state change always forms a new substance.', 'Gas particles expand because each particle becomes larger.'),
        topicSeed(4, 'Classification of matter', 'classification-of-matter', 'beginner', 'Classify matter as pure substance or mixture, and as element or compound.', 'Classification depends on composition and whether particles are chemically combined.', 'Anything uniform must be a pure substance.', 'Mixtures have fixed composition like compounds.'),
        topicSeed(5, 'Physical and chemical properties', 'physical-and-chemical-properties', 'beginner', 'Distinguish observations that do not change composition from changes that form new substances.', 'Physical properties describe state and measurement; chemical properties describe reactivity.', 'Every visible change is a chemical change.', 'A colour change always proves reaction.'),
        topicSeed(6, 'SI units and measurement', 'si-units-and-measurement', 'beginner', 'Use SI base units and common derived units for chemical measurement.', 'A measurement links a number to a unit, and units must travel with the number.', 'A number without a unit is enough.', 'mL and L can be mixed without conversion.'),
        topicSeed(7, 'Scientific notation', 'scientific-notation', 'beginner', 'Write very large and very small chemistry numbers using powers of ten.', 'Scientific notation keeps atomic and laboratory-scale numbers readable.', 'The exponent changes the value randomly.', 'Scientific notation is only for huge numbers.'),
        topicSeed(8, 'Significant figures', 'significant-figures', 'intermediate', 'Report measured results with the correct number of meaningful digits.', 'Significant figures communicate precision of measurement.', 'All zeros are never significant.', 'Copy every calculator digit.'),
        topicSeed(9, 'Precision and accuracy', 'precision-and-accuracy', 'intermediate', 'Separate closeness to true value from closeness among repeated readings.', 'Accuracy compares with true value; precision compares repeated readings.', 'Precise results are always accurate.', 'One reading proves precision.'),
        topicSeed(10, 'Dimensional analysis', 'dimensional-analysis', 'intermediate', 'Convert units by multiplying with conversion factors that cancel unwanted units.', 'Factor-label method builds a bridge from start unit to target unit.', 'Conversion factors can be placed in any direction.', 'Units are decoration.'),
        topicSeed(11, 'Laws of chemical combination', 'laws-of-chemical-combination', 'intermediate', 'Explain mass and volume patterns in reactions using classical laws.', 'Chemical combinations follow conservation, fixed composition, and simple ratios.', 'Mass can disappear during reaction.', 'Compounds can have any mass ratio.'),
        topicSeed(12, "Dalton's atomic theory", 'daltons-atomic-theory', 'beginner', "Connect Dalton's postulates with laws of chemical combination.", 'Atoms explain fixed ratios and conserved mass.', "Dalton's model explains all subatomic particles.", 'Atoms are destroyed during ordinary reactions.'),
        topicSeed(13, 'Atomic mass, molecular mass and formula mass', 'atomic-molecular-formula-mass', 'intermediate', 'Calculate molecular or formula mass by adding atomic masses in the formula.', 'Formula symbols and subscripts tell which atomic masses must be added.', 'Subscripts are ignored in formula mass.', 'Formula mass is number of atoms.'),
        topicSeed(14, 'Mole concept and Avogadro constant', 'mole-concept-avogadro-constant', 'intermediate', 'Use mole as a counting unit connecting mass, particles, and molar mass.', 'One mole contains 6.022 x 10^23 entities and links grams to particles.', 'Mole means molecule only.', 'Same mass always has same particle count.'),
        topicSeed(15, 'Percentage composition', 'percentage-composition', 'intermediate', 'Calculate the mass percent of each element in a compound.', 'Percent composition compares element mass with total molar mass.', 'Percent composition uses atom count directly.', 'Percent values need not add near 100.'),
        topicSeed(16, 'Empirical and molecular formula', 'empirical-and-molecular-formula', 'advanced', 'Find simplest whole-number ratios and scale them to molecular formula.', 'Empirical formula is simplest ratio; molecular formula may be a multiple.', 'Empirical and molecular formula are always identical.', 'Percent data can be used without converting to moles.'),
        topicSeed(17, 'Stoichiometry and balanced equations', 'stoichiometry-balanced-equations', 'advanced', 'Use balanced equations as mole-ratio maps between reactants and products.', 'Coefficients in a balanced equation give mole ratios for calculations.', 'Coefficients are direct mass ratios.', 'Stoichiometry can be done before balancing.'),
        topicSeed(18, 'Limiting reagent', 'limiting-reagent', 'advanced', 'Identify which reactant runs out first and controls product amount.', 'The limiting reagent stops the reaction; excess reagent remains.', 'The smaller mass is always limiting.', 'Both reactants always finish together.'),
        topicSeed(19, 'Concentration terms: molarity, molality, mole fraction, mass percent', 'concentration-terms', 'advanced', 'Choose and calculate common concentration terms for solutions.', 'Different concentration units compare solute with solution or solvent differently.', 'Molarity and molality are the same.', 'Mole fraction can be greater than one.'),
    ];
}

function topicSeed(int $order, string $title, string $slug, string $difficulty, string $goal, string $focus, string $misconceptionA, string $misconceptionB): array
{
    return compact('order', 'title', 'slug', 'difficulty', 'goal', 'focus', 'misconceptionA', 'misconceptionB');
}

function fetchId(PDO $pdo, string $sql, array $params = []): ?int
{
    $stmt = $pdo->prepare($sql);
    $stmt->execute($params);
    $value = $stmt->fetchColumn();
    return $value === false ? null : (int) $value;
}

function upsertBook(PDO $pdo, int $classId, int $subjectId, string $now): int
{
    $id = fetchId($pdo, 'SELECT id FROM books WHERE class_id = ? AND subject_id = ? AND title = ? LIMIT 1', [$classId, $subjectId, 'NCERT Class 11 Chemistry Part 1']);
    if ($id !== null) {
        $pdo->prepare('UPDATE books SET source = ?, language = ?, status = ?, updated_at = ? WHERE id = ?')
            ->execute(['NCERT', 'en', 'published', $now, $id]);
        return $id;
    }
    $pdo->prepare('INSERT INTO books (class_id, subject_id, title, source, language, status, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)')
        ->execute([$classId, $subjectId, 'NCERT Class 11 Chemistry Part 1', 'NCERT', 'en', 'published', $now, $now]);
    return (int) $pdo->lastInsertId();
}

function upsertChapter(PDO $pdo, int $bookId, int $classId, int $subjectId, string $now): int
{
    $slug = 'some-basic-concepts-of-chemistry';
    $id = fetchId($pdo, 'SELECT id FROM chapters WHERE class_id = ? AND slug = ? LIMIT 1', [$classId, $slug]);
    if ($id !== null) {
        $pdo->prepare('UPDATE chapters SET book_id = ?, subject_id = ?, chapter_number = ?, title = ?, status = ?, updated_at = ? WHERE id = ?')
            ->execute([$bookId, $subjectId, 1, 'Some Basic Concepts of Chemistry', 'published', $now, $id]);
        return $id;
    }
    $pdo->prepare('INSERT INTO chapters (book_id, class_id, subject_id, chapter_number, title, slug, status, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)')
        ->execute([$bookId, $classId, $subjectId, 1, 'Some Basic Concepts of Chemistry', $slug, 'published', $now, $now]);
    return (int) $pdo->lastInsertId();
}

function upsertTopic(PDO $pdo, int $chapterId, int $classId, int $subjectId, array $topic, string $now): int
{
    $id = fetchId($pdo, 'SELECT id FROM topics WHERE chapter_id = ? AND slug = ? LIMIT 1', [$chapterId, $topic['slug']]);
    if ($id !== null) {
        $pdo->prepare('UPDATE topics SET title = ?, order_index = ?, difficulty = ?, status = ?, updated_at = ? WHERE id = ?')
            ->execute([$topic['title'], $topic['order'], $topic['difficulty'], 'published', $now, $id]);
        return $id;
    }
    $pdo->prepare('INSERT INTO topics (chapter_id, class_id, subject_id, title, slug, order_index, difficulty, status, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)')
        ->execute([$chapterId, $classId, $subjectId, $topic['title'], $topic['slug'], $topic['order'], $topic['difficulty'], 'published', $now, $now]);
    return (int) $pdo->lastInsertId();
}

function upsertLearningResource(PDO $pdo, array $resource, string $now): int
{
    $id = fetchId($pdo, 'SELECT id FROM learning_resources WHERE slug = ? LIMIT 1', [$resource['slug']]);
    $values = [
        $resource['class_id'],
        $resource['subject_id'],
        $resource['chapter_id'],
        $resource['topic_id'],
        $resource['type'],
        $resource['title'],
        $resource['description'],
        $resource['route_url'],
        $resource['content_json'],
        $resource['source_type'],
        $resource['source_reference'],
        $resource['status'],
        $resource['quality_status'],
        $resource['why_useful'],
        $resource['student_instructions'],
        $resource['student_level'],
        $resource['estimated_minutes'],
        $now,
    ];
    if ($id !== null) {
        $pdo->prepare('UPDATE learning_resources SET class_id = ?, subject_id = ?, chapter_id = ?, topic_id = ?, type = ?, title = ?, description = ?, route_url = ?, content_json = ?, source_type = ?, source_reference = ?, status = ?, quality_status = ?, why_useful = ?, student_instructions = ?, student_level = ?, estimated_minutes = ?, updated_at = ? WHERE id = ?')
            ->execute([...$values, $id]);
        return $id;
    }

    $pdo->prepare('INSERT INTO learning_resources (uuid, class_id, subject_id, chapter_id, topic_id, type, title, slug, description, route_url, content_json, source_type, source_reference, status, quality_status, why_useful, student_instructions, student_level, estimated_minutes, published_at, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)')
        ->execute([
            $resource['uuid'],
            $resource['class_id'],
            $resource['subject_id'],
            $resource['chapter_id'],
            $resource['topic_id'],
            $resource['type'],
            $resource['title'],
            $resource['slug'],
            $resource['description'],
            $resource['route_url'],
            $resource['content_json'],
            $resource['source_type'],
            $resource['source_reference'],
            $resource['status'],
            $resource['quality_status'],
            $resource['why_useful'],
            $resource['student_instructions'],
            $resource['student_level'],
            $resource['estimated_minutes'],
            $now,
            $now,
            $now,
        ]);
    return (int) $pdo->lastInsertId();
}

function upsertConceptMap(PDO $pdo, int $classId, int $subjectId, int $chapterId, string $sourceReference, string $now): void
{
    $slug = 'some-basic-concepts-of-chemistry-map';
    $map = [
        'nodes' => [
            ['id' => 'matter', 'label' => 'Matter'],
            ['id' => 'measurement', 'label' => 'Measurement'],
            ['id' => 'mole', 'label' => 'Mole concept'],
            ['id' => 'formula', 'label' => 'Formula work'],
            ['id' => 'stoichiometry', 'label' => 'Stoichiometry'],
        ],
        'edges' => [
            ['from' => 'matter', 'to' => 'measurement'],
            ['from' => 'measurement', 'to' => 'mole'],
            ['from' => 'mole', 'to' => 'formula'],
            ['from' => 'formula', 'to' => 'stoichiometry'],
        ],
    ];
    $id = fetchId($pdo, 'SELECT id FROM concept_maps WHERE slug = ? LIMIT 1', [$slug]);
    if ($id !== null) {
        $pdo->prepare('UPDATE concept_maps SET class_id = ?, subject_id = ?, chapter_id = ?, title = ?, description = ?, map_json = ?, status = ?, source_reference = ?, updated_at = ? WHERE id = ?')
            ->execute([$classId, $subjectId, $chapterId, 'Some Basic Concepts of Chemistry Map', 'Unit 1 map for matter, measurement, mole concept and stoichiometry.', json_encode($map, JSON_UNESCAPED_SLASHES), 'published', $sourceReference, $now, $id]);
        return;
    }
    $pdo->prepare('INSERT INTO concept_maps (uuid, class_id, subject_id, chapter_id, topic_id, title, slug, description, map_json, status, source_reference, created_at, updated_at) VALUES (?, ?, ?, ?, NULL, ?, ?, ?, ?, ?, ?, ?, ?)')
        ->execute(['stage8-concept-map-unit1', $classId, $subjectId, $chapterId, 'Some Basic Concepts of Chemistry Map', $slug, 'Unit 1 map for matter, measurement, mole concept and stoichiometry.', json_encode($map, JSON_UNESCAPED_SLASHES), 'published', $sourceReference, $now, $now]);
}

function upsertDecksAndCards(PDO $pdo, int $classId, int $subjectId, int $chapterId, int $resourceId, array $topics, string $sourceReference, string $now): void
{
    $decks = [
        ['Scientific Notation & Significant Figures', 'scientific-notation-significant-figures', ['scientific-notation', 'significant-figures', 'precision-and-accuracy']],
        ['Mole Concept Starter', 'mole-concept-starter', ['atomic-molecular-formula-mass', 'mole-concept-avogadro-constant', 'percentage-composition']],
        ['Stoichiometry Starter', 'stoichiometry-starter', ['stoichiometry-balanced-equations', 'limiting-reagent', 'concentration-terms']],
        ['Laws of Chemical Combination', 'laws-of-chemical-combination', ['laws-of-chemical-combination', 'daltons-atomic-theory']],
    ];

    foreach ($decks as [$title, $slug, $topicSlugs]) {
        $deckId = fetchId($pdo, 'SELECT id FROM memory_decks WHERE slug = ? LIMIT 1', [$slug]);
        if ($deckId !== null) {
            $pdo->prepare('UPDATE memory_decks SET class_id = ?, subject_id = ?, chapter_id = ?, resource_id = ?, title = ?, description = ?, status = ?, source_reference = ?, updated_at = ? WHERE id = ?')
                ->execute([$classId, $subjectId, $chapterId, $resourceId, $title, 'Class 11 Unit 1 smart memory cards for review and mistake repair.', 'published', $sourceReference, $now, $deckId]);
        } else {
            $pdo->prepare('INSERT INTO memory_decks (uuid, class_id, subject_id, chapter_id, topic_id, resource_id, title, slug, description, language, difficulty, status, source_type, source_reference, created_at, updated_at) VALUES (?, ?, ?, ?, NULL, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)')
                ->execute(['stage8-deck-' . $slug, $classId, $subjectId, $chapterId, $resourceId, $title, $slug, 'Class 11 Unit 1 smart memory cards for review and mistake repair.', 'en', 'intermediate', 'published', 'CUSTOM', $sourceReference, $now, $now]);
            $deckId = (int) $pdo->lastInsertId();
        }

        $order = 1;
        foreach ($topics as $topic) {
            if (!in_array($topic['slug'], $topicSlugs, true)) {
                continue;
            }
            foreach (memoryCardsForTopic($topic) as $card) {
                upsertMemoryCard($pdo, $deckId, $card, $sourceReference, $order++, $now);
            }
        }
    }
}

function memoryCardsForTopic(array $topic): array
{
    return [
        ['front' => 'Core idea: ' . $topic['title'], 'back' => $topic['goal'], 'hint' => 'State the concept in one sentence.', 'explanation' => $topic['focus'], 'type' => 'concept'],
        ['front' => 'Example: ' . $topic['title'], 'back' => 'Use this in a Class 11 problem before calculating.', 'hint' => 'Connect the idea to a visible quantity.', 'explanation' => $topic['focus'], 'type' => 'application'],
        ['front' => 'Trap 1: ' . $topic['title'], 'back' => $topic['misconceptionA'], 'hint' => 'Look for the first shortcut.', 'explanation' => 'Correct it by returning to the main concept.', 'type' => 'mistake'],
        ['front' => 'Trap 2: ' . $topic['title'], 'back' => $topic['misconceptionB'], 'hint' => 'Look for the hidden assumption.', 'explanation' => 'Correct it by checking units, particles, ratios, or conditions.', 'type' => 'mistake'],
        ['front' => 'Chem-Shastri prompt: ' . $topic['title'], 'back' => 'Ask for one example, one mistake, and one practice question.', 'hint' => 'Use guided revision.', 'explanation' => 'Chem-Shastri should guide, not only answer.', 'type' => 'application'],
    ];
}

function upsertMemoryCard(PDO $pdo, int $deckId, array $card, string $sourceReference, int $order, string $now): void
{
    $id = fetchId($pdo, 'SELECT id FROM memory_cards WHERE deck_id = ? AND front = ? LIMIT 1', [$deckId, $card['front']]);
    $params = [$card['back'], $card['hint'], $card['explanation'], 'intermediate', $card['type'], $sourceReference, $order, 'published', $now];
    if ($id !== null) {
        $pdo->prepare('UPDATE memory_cards SET back = ?, hint = ?, explanation = ?, difficulty = ?, card_type = ?, source_reference = ?, order_index = ?, status = ?, updated_at = ? WHERE id = ?')
            ->execute([...$params, $id]);
        return;
    }
    $pdo->prepare('INSERT INTO memory_cards (deck_id, front, back, hint, explanation, difficulty, card_type, source_reference, order_index, status, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)')
        ->execute([$deckId, $card['front'], ...$params, $now]);
}

function upsertDrillsAndQuestions(PDO $pdo, int $classId, int $subjectId, int $chapterId, int $resourceId, array $topics, string $sourceReference, string $now): void
{
    $drills = [
        ['SI Units and Scientific Notation Drill', 'si-units-scientific-notation-drill', ['si-units-and-measurement', 'scientific-notation']],
        ['Significant Figures Drill', 'significant-figures-drill', ['significant-figures', 'precision-and-accuracy']],
        ['Mole Concept Drill', 'mole-concept-drill', ['atomic-molecular-formula-mass', 'mole-concept-avogadro-constant']],
        ['Stoichiometry Drill', 'stoichiometry-drill', ['stoichiometry-balanced-equations', 'limiting-reagent']],
    ];

    foreach ($drills as [$title, $slug, $topicSlugs]) {
        $drillId = fetchId($pdo, 'SELECT id FROM quick_drills WHERE slug = ? LIMIT 1', [$slug]);
        if ($drillId !== null) {
            $pdo->prepare('UPDATE quick_drills SET class_id = ?, subject_id = ?, chapter_id = ?, resource_id = ?, title = ?, description = ?, estimated_minutes = ?, status = ?, source_reference = ?, updated_at = ? WHERE id = ?')
                ->execute([$classId, $subjectId, $chapterId, $resourceId, $title, 'Class 11 Unit 1 quick drill for immediate practice.', 8, 'published', $sourceReference, $now, $drillId]);
        } else {
            $pdo->prepare('INSERT INTO quick_drills (uuid, class_id, subject_id, chapter_id, topic_id, resource_id, title, slug, description, language, difficulty, estimated_minutes, status, source_type, source_reference, created_at, updated_at) VALUES (?, ?, ?, ?, NULL, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)')
                ->execute(['stage8-drill-' . $slug, $classId, $subjectId, $chapterId, $resourceId, $title, $slug, 'Class 11 Unit 1 quick drill for immediate practice.', 'en', 'intermediate', 8, 'published', 'CUSTOM', $sourceReference, $now, $now]);
            $drillId = (int) $pdo->lastInsertId();
        }

        $order = 1;
        foreach ($topics as $topic) {
            if (!in_array($topic['slug'], $topicSlugs, true)) {
                continue;
            }
            $topicId = isset($topic['id']) && $topic['id'] !== null
                ? (int) $topic['id']
                : fetchId($pdo, 'SELECT id FROM topics WHERE chapter_id = ? AND slug = ? LIMIT 1', [$chapterId, $topic['slug']]);

            foreach (questionsForTopic($topic) as $question) {
                upsertQuizQuestion($pdo, $drillId, $classId, $subjectId, $chapterId, $topicId, $question, $sourceReference, $order++, $now);
            }
        }
    }
}

function questionsForTopic(array $topic): array
{
    return [
        ['q' => 'Which statement best fits ' . $topic['title'] . '?', 'options' => [$topic['goal'], $topic['misconceptionA'], $topic['misconceptionB']], 'answer' => $topic['goal'], 'explanation' => $topic['focus'], 'mistake' => 'unit1_' . str_replace('-', '_', $topic['slug'])],
        ['q' => 'Which is the common trap in ' . $topic['title'] . '?', 'options' => [$topic['misconceptionA'], $topic['goal'], 'The concept never appears in numerical problems.'], 'answer' => $topic['misconceptionA'], 'explanation' => 'This is a misconception that needs correction before practice.', 'mistake' => 'unit1_' . str_replace('-', '_', $topic['slug'])],
        ['q' => 'What should a student do first for ' . $topic['title'] . '?', 'options' => ['Name the concept and check the units or ratio.', 'Copy the largest number.', 'Skip the source reference.'], 'answer' => 'Name the concept and check the units or ratio.', 'explanation' => 'Clear reasoning comes before calculation.', 'mistake' => 'unit1_reasoning'],
        ['q' => 'How should Chem-Shastri help with ' . $topic['title'] . '?', 'options' => ['Show one example and one trap.', 'Only reveal final answer.', 'Ignore the student level.'], 'answer' => 'Show one example and one trap.', 'explanation' => 'Guided learning builds mastery and catches mistakes.', 'mistake' => 'unit1_guidance'],
        ['q' => 'Why is ' . $topic['title'] . ' part of Unit 1?', 'options' => ['It supports later formula and numerical chemistry.', 'It is only history.', 'It replaces balanced equations.'], 'answer' => 'It supports later formula and numerical chemistry.', 'explanation' => 'Unit 1 builds the measurement and particle-count foundation.', 'mistake' => 'unit1_foundation'],
    ];
}

function upsertQuizQuestion(PDO $pdo, int $drillId, int $classId, int $subjectId, int $chapterId, ?int $topicId, array $question, string $sourceReference, int $order, string $now): void
{
    $id = fetchId($pdo, 'SELECT id FROM quiz_questions WHERE drill_id = ? AND question_text = ? LIMIT 1', [$drillId, $question['q']]);
    $params = [
        $classId,
        $subjectId,
        $chapterId,
        $topicId,
        $question['q'],
        'mcq',
        json_encode($question['options'], JSON_UNESCAPED_SLASHES),
        json_encode([$question['answer']], JSON_UNESCAPED_SLASHES),
        $question['explanation'],
        'Choose the option that explains the concept, not the trap.',
        'intermediate',
        $question['mistake'],
        $sourceReference,
        $order,
        'published',
        $now,
    ];
    if ($id !== null) {
        $pdo->prepare('UPDATE quiz_questions SET class_id = ?, subject_id = ?, chapter_id = ?, topic_id = ?, question_text = ?, question_type = ?, options_json = ?, correct_answer_json = ?, explanation = ?, hint = ?, difficulty = ?, mistake_type = ?, source_reference = ?, order_index = ?, status = ?, updated_at = ? WHERE id = ?')
            ->execute([...$params, $id]);
        return;
    }
    $pdo->prepare('INSERT INTO quiz_questions (drill_id, class_id, subject_id, chapter_id, topic_id, question_text, question_type, options_json, correct_answer_json, explanation, hint, difficulty, mistake_type, source_reference, order_index, status, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)')
        ->execute([$drillId, ...$params, $now]);
}

function upsertMistakePatterns(PDO $pdo, int $classId, int $subjectId, int $chapterId, int $topicId, array $topic, string $now): void
{
    $base = 'unit1_' . str_replace('-', '_', $topic['slug']);
    $items = [
        [$base . '_trap_1', $topic['title'] . ': first trap', $topic['misconceptionA'], 'Return to the anchor idea: ' . $topic['focus'], $topic['goal']],
        [$base . '_trap_2', $topic['title'] . ': second trap', $topic['misconceptionB'], 'Check the unit, particle, ratio, or condition being compared.', $topic['goal']],
    ];
    foreach ($items as [$key, $title, $description, $correction, $example]) {
        $id = fetchId($pdo, 'SELECT id FROM mistake_patterns WHERE mistake_key = ? LIMIT 1', [$key]);
        $params = [$classId, $subjectId, $chapterId, $topicId, $key, $title, $description, $correction, $example, 'medium', 'published', $now];
        if ($id !== null) {
            $pdo->prepare('UPDATE mistake_patterns SET class_id = ?, subject_id = ?, chapter_id = ?, topic_id = ?, mistake_key = ?, title = ?, description = ?, correction = ?, example = ?, severity = ?, status = ?, updated_at = ? WHERE id = ?')
                ->execute([...$params, $id]);
        } else {
            $pdo->prepare('INSERT INTO mistake_patterns (class_id, subject_id, chapter_id, topic_id, mistake_key, title, description, correction, example, severity, status, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)')
                ->execute([...$params, $now]);
        }
    }
}

function upsertTeacherQuizPacks(PDO $pdo, string $sourceReference, string $now): void
{
    $adminId = fetchId($pdo, "SELECT id FROM users WHERE role = 'admin' ORDER BY id ASC LIMIT 1");
    if ($adminId === null) {
        return;
    }
    $packs = [
        ['si-units-scientific-notation-drill', 'Class 11 Unit 1 - Measurement and SI Units', 'class-11-unit-1-measurement-si-units', 'Teacher-ready quiz for measurement, SI units, and scientific notation.'],
        ['mole-concept-drill', 'Class 11 Unit 1 - Mole Concept', 'class-11-unit-1-mole-concept', 'Teacher-ready quiz for molar mass, moles, and particles.'],
        ['stoichiometry-drill', 'Class 11 Unit 1 - Stoichiometry Basics', 'class-11-unit-1-stoichiometry-basics', 'Teacher-ready quiz for balanced equations and limiting reagent.'],
    ];

    foreach ($packs as [$drillSlug, $title, $slug, $description]) {
        $drillId = fetchId($pdo, 'SELECT id FROM quick_drills WHERE slug = ? LIMIT 1', [$drillSlug]);
        if ($drillId === null) {
            continue;
        }
        $quizId = fetchId($pdo, 'SELECT id FROM teacher_quizzes WHERE slug = ? LIMIT 1', [$slug]);
        if ($quizId !== null) {
            $pdo->prepare('UPDATE teacher_quizzes SET title = ?, description = ?, source_drill_id = ?, status = ?, visibility = ?, quality_status = ?, source_reference = ?, updated_at = ? WHERE id = ?')
                ->execute([$title, $description, $drillId, 'published', 'public', 'needs_review', $sourceReference, $now, $quizId]);
        } else {
            $drillMeta = fetchDrillMeta($pdo, $drillId);
            $pdo->prepare('INSERT INTO teacher_quizzes (uuid, teacher_user_id, title, slug, description, class_id, subject_id, chapter_id, topic_id, source_drill_id, status, visibility, time_limit_minutes, shuffle_questions, show_correct_after_each, show_leaderboard, quality_status, source_reference, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, NULL, ?, ?, ?, ?, 0, 1, 1, ?, ?, ?, ?)')
                ->execute(['stage8-quiz-' . $slug, $adminId, $title, $slug, $description, $drillMeta['class_id'], $drillMeta['subject_id'], $drillMeta['chapter_id'], $drillId, 'published', 'public', 10, 'needs_review', $sourceReference, $now, $now]);
            $quizId = (int) $pdo->lastInsertId();
        }
        copyDrillQuestionsToTeacherQuiz($pdo, $drillId, $quizId, $now);
    }
}

function fetchDrillMeta(PDO $pdo, int $drillId): array
{
    $stmt = $pdo->prepare('SELECT class_id, subject_id, chapter_id FROM quick_drills WHERE id = ? LIMIT 1');
    $stmt->execute([$drillId]);
    return $stmt->fetch(PDO::FETCH_ASSOC) ?: ['class_id' => null, 'subject_id' => null, 'chapter_id' => null];
}

function copyDrillQuestionsToTeacherQuiz(PDO $pdo, int $drillId, int $quizId, string $now): void
{
    $stmt = $pdo->prepare('SELECT question_text, question_type, options_json, correct_answer_json, explanation, hint, mistake_type, order_index FROM quiz_questions WHERE drill_id = ? AND status = ? ORDER BY order_index ASC');
    $stmt->execute([$drillId, 'published']);
    foreach ($stmt->fetchAll(PDO::FETCH_ASSOC) as $question) {
        $existing = fetchId($pdo, 'SELECT id FROM teacher_quiz_questions WHERE quiz_id = ? AND question_text = ? LIMIT 1', [$quizId, $question['question_text']]);
        $params = [$question['question_text'], $question['question_type'], $question['options_json'], $question['correct_answer_json'], $question['explanation'], $question['hint'], 1, $question['mistake_type'], $question['order_index'], $now];
        if ($existing !== null) {
            $pdo->prepare('UPDATE teacher_quiz_questions SET question_text = ?, question_type = ?, options_json = ?, correct_answer_json = ?, explanation = ?, hint = ?, points = ?, mistake_key = ?, order_index = ?, updated_at = ? WHERE id = ?')
                ->execute([...$params, $existing]);
            continue;
        }
        $pdo->prepare('INSERT INTO teacher_quiz_questions (quiz_id, question_text, question_type, options_json, correct_answer_json, explanation, hint, points, mistake_key, order_index, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)')
            ->execute([$quizId, ...$params, $now]);
    }
}

function upsertSiteSettings(PDO $pdo, string $now): void
{
    $settings = [
        ['unit1_content_factory_status', 'needs_review', null, 'string', 0],
        ['unit1_chem_shastri_context', 'Class 11 Unit 1 context available for matter, measurement, mole concept, and stoichiometry.', null, 'string', 0],
    ];
    foreach ($settings as [$key, $value, $json, $type, $public]) {
        $id = fetchId($pdo, 'SELECT id FROM site_settings WHERE setting_key = ? LIMIT 1', [$key]);
        if ($id !== null) {
            $pdo->prepare('UPDATE site_settings SET setting_value = ?, setting_json = ?, type = ?, is_public = ?, updated_at = ? WHERE id = ?')
                ->execute([$value, $json, $type, $public, $now, $id]);
        } else {
            $pdo->prepare('INSERT INTO site_settings (setting_key, setting_value, setting_json, type, is_public, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?)')
                ->execute([$key, $value, $json, $type, $public, $now, $now]);
        }
    }
}
