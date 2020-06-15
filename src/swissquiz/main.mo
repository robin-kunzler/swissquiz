import AssocList "mo:base/AssocList";
import HashMap "mo:base/HashMap";
import List "mo:base/List";
import Nat "mo:base/Nat";
import Hash "mo:base/Hash";
import Option "mo:base/Option";

type List<V> = List.List<V>;
type HashMap<K,V> = HashMap.HashMap<K,V>;
type AssocList<K,V> = AssocList.AssocList<K,V>;
type Hash = Hash.Hash;

type GameId = {
    id: Nat;
};

type Answer = {
    #A; #B; #C; #D;
};

type Question = {
    question_text: Text; 
    answers: AssocList<Answer, Text>;
};

type QuestionId = { 
    id: Nat;
};

class Game (player_name: Text,
  selected_questions: List<QuestionId>) {
    var cur_selected_question_index = 0;

    // returns the text of the current question
    public func current_question(): Question {
        let cur_question_id: QuestionId = 
            Option.unwrap<QuestionId>(
                List.nth<QuestionId>(selected_questions, cur_selected_question_index)
            );
        Option.unwrap<Question>(
            AssocList.find<QuestionId, Question>(questions, cur_question_id, question_id_eq)
        )
    };

    func question_id_eq(first: QuestionId, second: QuestionId) : Bool {
        first.id == second.id
    };
};

var question_1_answers = List.fromArray<(Answer, Text)>(
    [
        (#A, "answer A"), 
        (#B, "answer B"), 
        (#C, "answer C"), 
        (#D, "answer D"), 
    ]
);

var question_1 : Question = {
    question_text = "sample question text";
    answers= question_1_answers
};

var question_id_1 : QuestionId = {id = 1};

var questions: AssocList<QuestionId, Question> = List.fromArray<(QuestionId, Question)>([
        (question_id_1, question_1 ),
    ]);

var games: AssocList<GameId, Game> = List.nil<(GameId, Game)>();

var game_id_counter: Nat = 0;

actor {
    public func start_game(player_name : Text) : async GameId {
        game_id_counter += 1;
        var game = Game( player_name, List.fromArray<QuestionId>([question_id_1]));
        let game_id : GameId = {
		    id = game_id_counter;
	    };
        games := List.push<(GameId, Game)>((game_id, game), games);
        game_id
    };

    public query func current_question(game_id: GameId) : async Question {
        var game: Game = Option.unwrap<Game>(AssocList.find<GameId, Game>(games, game_id,game_id_eq ));
        game.current_question()
    };

    public func greet(name : Text) : async Text {
        return "Hello, " # name # "!";
    };

    func game_id_eq(first: GameId, second: GameId) : Bool {
        first.id == second.id
    };

};