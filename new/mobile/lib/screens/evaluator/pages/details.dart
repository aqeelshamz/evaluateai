import 'package:evaluateai/providers/classes.dart';
import 'package:evaluateai/providers/evaluator.dart';
import 'package:evaluateai/utils/colors.dart';
import 'package:flutter/material.dart';
import 'package:flutter_feather_icons/flutter_feather_icons.dart';
import 'package:get/get.dart';
import 'package:provider/provider.dart';

class EvaluatorDetailsPage extends StatefulWidget {
  const EvaluatorDetailsPage({super.key});

  @override
  State<EvaluatorDetailsPage> createState() => _EvaluatorDetailsPageState();
}

class _EvaluatorDetailsPageState extends State<EvaluatorDetailsPage> {
  TextEditingController titleController = TextEditingController();
  TextEditingController descriptionController = TextEditingController();
  String classId = "";

  @override
  void initState() {
    getData();
    super.initState();
  }

  void getData() async {
    var evaluatorProvider =
        Provider.of<EvaluatorProvider>(Get.context!, listen: false);
    await evaluatorProvider.getEvaluator();
    titleController.text = evaluatorProvider.evaluatorData["title"];
    descriptionController.text = evaluatorProvider.evaluatorData["description"];
    setState(() {
      classId = evaluatorProvider.evaluatorData["classId"]["_id"];
    });
  }

  @override
  Widget build(BuildContext context) {
    var classesProvider = Provider.of<ClassesProvider>(context, listen: true);

    return Container(
      width: Get.width,
      height: Get.height,
      padding: const EdgeInsets.all(20),
      child: ListView(
        children: [
          Text("Title"),
          const SizedBox(height: 10),
          TextField(
            controller: titleController,
            decoration: InputDecoration(
              hintText: "Title",
              border: OutlineInputBorder(
                borderRadius: BorderRadius.circular(15),
              ),
            ),
          ),
          const SizedBox(height: 20),
          Text("Description (optional)"),
          const SizedBox(height: 10),
          TextField(
            controller: descriptionController,
            decoration: InputDecoration(
              hintText: "Description (optional)",
              border: OutlineInputBorder(
                borderRadius: BorderRadius.circular(15),
              ),
            ),
            maxLines: 4,
          ),
          const SizedBox(height: 20),
          Text("Class"),
          const SizedBox(height: 10),
          classesProvider.classes.isEmpty || classId.isEmpty
              ? const SizedBox.shrink()
              : DropdownButtonFormField(
                  decoration: InputDecoration(
                      hintText: "Class",
                      border: OutlineInputBorder(
                        borderRadius: BorderRadius.circular(15),
                      )),
                  items: getDropdownItems(),
                  onChanged: (value) {
                    classId = value.toString();
                  },
                  value: classId,
                ),
          const SizedBox(height: 20),
          TextButton.icon(
            onPressed: () {
              Provider.of<EvaluatorProvider>(context, listen: false)
                  .updateEvaluator(titleController.text,
                      descriptionController.text, classId);
            },
            style: TextButton.styleFrom(
              padding: EdgeInsets.symmetric(vertical: 15),
              backgroundColor: primaryColor,
              foregroundColor: Colors.white,
            ),
            icon: Icon(FeatherIcons.save),
            label: Text("Save"),
          ),
          const SizedBox(height: 10),
          TextButton.icon(
            onPressed: () {
              showDialog(
                  context: context,
                  builder: (context) {
                    return AlertDialog(
                      title: Row(
                        children: [
                          Icon(FeatherIcons.trash2),
                          const SizedBox(
                            width: 5,
                          ),
                          Text("Delete Evaluator"),
                        ],
                      ),
                      content: Text(
                        "Are you sure you want to delete this evaluator?",
                      ),
                      actions: [
                        TextButton(
                          onPressed: () {
                            Get.back();
                          },
                          child: Text("Cancel"),
                        ),
                        TextButton(
                          onPressed: (){
                            Provider.of<EvaluatorProvider>(context, listen: false)
                                .deleteEvaluator();
                          },
                          child: Text(
                            "Delete",
                            style: TextStyle(
                              color: Colors.red,
                            ),
                          ),
                        ),
                      ],
                    );
                  });
            },
            style: TextButton.styleFrom(
              padding: EdgeInsets.symmetric(vertical: 15),
              backgroundColor: Colors.white,
            ),
            icon: Icon(FeatherIcons.trash2),
            label: Text("Delete"),
          ),
        ],
      ),
    );
  }

  List<DropdownMenuItem> getDropdownItems() {
    List<DropdownMenuItem> items = [];

    var classesProvider = Provider.of<ClassesProvider>(context, listen: false);

    for (var i = 0; i < classesProvider.classes.length; i++) {
      items.add(DropdownMenuItem(
        value: classesProvider.classes[i]["_id"],
        child: Text(classesProvider.classes[i]["name"]),
      ));
    }

    return items;
  }
}
