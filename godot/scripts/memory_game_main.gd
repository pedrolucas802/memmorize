extends Node2D


func _ready() -> void:
	pass 


func _process(delta: float) -> void:
	pass

func _on_button_return_pressed() -> void:
	print("Go back to the menu")
	get_tree().change_scene_to_file("res://scenes/main_menu.tscn")
