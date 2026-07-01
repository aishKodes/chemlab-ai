<?php

declare(strict_types=1);

namespace Chemlab\Controllers;

use Chemlab\Helpers\Request;
use Chemlab\Helpers\Response;
use PDO;

final class PublicLearningController
{
    public function __construct(private readonly PDO $pdo)
    {
    }

    public function memoryDecks(Request $request): Response
    {
        $stmt = $this->pdo->prepare(
            'SELECT memory_decks.*, classes.class_level, subjects.name AS subject_name,
                    COUNT(memory_cards.id) AS card_count
             FROM memory_decks
             LEFT JOIN classes ON classes.id = memory_decks.class_id
             LEFT JOIN subjects ON subjects.id = memory_decks.subject_id
             LEFT JOIN memory_cards ON memory_cards.deck_id = memory_decks.id AND memory_cards.status = "published"
             WHERE memory_decks.status = "published"
             GROUP BY memory_decks.id
             ORDER BY memory_decks.updated_at DESC'
        );
        $stmt->execute();

        return Response::ok(['decks' => $stmt->fetchAll()]);
    }

    public function memoryDeck(Request $request, array $params): Response
    {
        $deck = $this->findByIdOrSlug('memory_decks', (string) ($params['idOrSlug'] ?? ''));
        if (!$deck) {
            return Response::error('NOT_FOUND', 'Memory deck not found.', 404);
        }

        return Response::ok(['deck' => $deck]);
    }

    public function memoryCards(Request $request, array $params): Response
    {
        $deck = $this->findByIdOrSlug('memory_decks', (string) ($params['idOrSlug'] ?? ''));
        if (!$deck) {
            return Response::error('NOT_FOUND', 'Memory deck not found.', 404);
        }

        $stmt = $this->pdo->prepare(
            'SELECT * FROM memory_cards WHERE deck_id = :deck_id AND status = "published" ORDER BY order_index ASC, id ASC'
        );
        $stmt->execute(['deck_id' => $deck['id']]);

        return Response::ok(['deck' => $deck, 'cards' => $stmt->fetchAll()]);
    }

    public function quickDrills(Request $request): Response
    {
        $stmt = $this->pdo->prepare(
            'SELECT quick_drills.*, classes.class_level, subjects.name AS subject_name,
                    COUNT(quiz_questions.id) AS question_count
             FROM quick_drills
             LEFT JOIN classes ON classes.id = quick_drills.class_id
             LEFT JOIN subjects ON subjects.id = quick_drills.subject_id
             LEFT JOIN quiz_questions ON quiz_questions.drill_id = quick_drills.id AND quiz_questions.status = "published"
             WHERE quick_drills.status = "published"
             GROUP BY quick_drills.id
             ORDER BY quick_drills.updated_at DESC'
        );
        $stmt->execute();

        return Response::ok(['drills' => $stmt->fetchAll()]);
    }

    public function quickDrill(Request $request, array $params): Response
    {
        $drill = $this->findByIdOrSlug('quick_drills', (string) ($params['idOrSlug'] ?? ''));
        if (!$drill) {
            return Response::error('NOT_FOUND', 'Quick drill not found.', 404);
        }

        return Response::ok(['drill' => $drill]);
    }

    public function quickDrillQuestions(Request $request, array $params): Response
    {
        $drill = $this->findByIdOrSlug('quick_drills', (string) ($params['idOrSlug'] ?? ''));
        if (!$drill) {
            return Response::error('NOT_FOUND', 'Quick drill not found.', 404);
        }

        $stmt = $this->pdo->prepare(
            'SELECT id, drill_id, class_id, subject_id, chapter_id, topic_id, question_text, question_type,
                    options_json, explanation, hint, difficulty, mistake_type, order_index
             FROM quiz_questions
             WHERE drill_id = :drill_id AND status = "published"
             ORDER BY order_index ASC, id ASC'
        );
        $stmt->execute(['drill_id' => $drill['id']]);

        return Response::ok(['drill' => $drill, 'questions' => array_map([$this, 'shapeQuestion'], $stmt->fetchAll())]);
    }

    public function conceptMaps(Request $request): Response
    {
        $stmt = $this->pdo->prepare(
            'SELECT concept_maps.*, classes.class_level, subjects.name AS subject_name
             FROM concept_maps
             LEFT JOIN classes ON classes.id = concept_maps.class_id
             LEFT JOIN subjects ON subjects.id = concept_maps.subject_id
             WHERE concept_maps.status = "published"
             ORDER BY concept_maps.updated_at DESC'
        );
        $stmt->execute();

        return Response::ok(['concept_maps' => array_map([$this, 'shapeConceptMap'], $stmt->fetchAll())]);
    }

    public function conceptMap(Request $request, array $params): Response
    {
        $map = $this->findByIdOrSlug('concept_maps', (string) ($params['idOrSlug'] ?? ''));
        if (!$map) {
            return Response::error('NOT_FOUND', 'Concept map not found.', 404);
        }

        return Response::ok(['concept_map' => $this->shapeConceptMap($map)]);
    }

    private function findByIdOrSlug(string $table, string $idOrSlug): ?array
    {
        $field = ctype_digit($idOrSlug) ? 'id' : 'slug';
        $stmt = $this->pdo->prepare("SELECT * FROM {$table} WHERE {$field} = :value AND status = \"published\" LIMIT 1");
        $stmt->execute(['value' => $idOrSlug]);
        $row = $stmt->fetch();

        return $row ?: null;
    }

    private function shapeQuestion(array $row): array
    {
        $row['options_json'] = $this->decodeJson($row['options_json'] ?? null);
        return $row;
    }

    private function shapeConceptMap(array $row): array
    {
        $row['map_json'] = $this->decodeJson($row['map_json'] ?? null);
        return $row;
    }

    private function decodeJson(mixed $value): mixed
    {
        if (!is_string($value) || $value === '') {
            return null;
        }

        $decoded = json_decode($value, true);
        return json_last_error() === JSON_ERROR_NONE ? $decoded : $value;
    }
}
