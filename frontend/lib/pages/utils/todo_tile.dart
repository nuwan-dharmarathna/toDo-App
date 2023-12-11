import 'package:flutter/material.dart';
import 'package:flutter_slidable/flutter_slidable.dart';

class ToDoTile extends StatelessWidget {
  final String taskName;
  final bool isCompleted;
  Function(bool?)? onChanged;
  Function(BuildContext)? deleteFunction;

  ToDoTile({
    super.key,
    required this.taskName,
    required this.isCompleted,
    required this.onChanged,
    required this.deleteFunction,
  });

  @override
  Widget build(BuildContext context) {
    return Slidable(
      endActionPane: ActionPane(
        motion: const StretchMotion(),
        children: [
          SlidableAction(
            onPressed: deleteFunction,
            icon: Icons.delete,
            backgroundColor: Colors.red,
            borderRadius: BorderRadius.circular(15),
          ),
        ],
      ),
      child: Padding(
        padding: const EdgeInsets.all(8.0),
        child: Container(
          padding: const EdgeInsets.only(left: 20, right: 20, top: 20),
          decoration: BoxDecoration(
            color: Color.fromARGB(255, 53, 48, 48),
            borderRadius: BorderRadius.circular(15),
          ),
          child: Row(children: [
            Checkbox(
              value: isCompleted,
              onChanged: onChanged,
              activeColor: Colors.white,
            ),
            Text(
              taskName,
              style: TextStyle(
                fontSize: 15,
                fontWeight: FontWeight.bold,
                color: const Color.fromARGB(255, 242, 237, 237),
                fontStyle:
                    isCompleted == true ? FontStyle.italic : FontStyle.normal,
                decoration: isCompleted == true
                    ? TextDecoration.lineThrough
                    : TextDecoration.none,
              ),
            ),
          ]),
        ),
      ),
    );
  }
}
