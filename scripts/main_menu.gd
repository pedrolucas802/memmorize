extends Control


func _ready() -> void:
	pass


func _process(delta: float) -> void:
	pass


func _on_button_start_pressed() -> void:
	print("Start")
	get_tree().change_scene_to_file("res://scenes/memory_game.tscn")


func _on_button_exit_pressed() -> void:
	print("Exit!")
	get_tree().quit()
