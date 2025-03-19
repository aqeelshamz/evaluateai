import 'package:evaluateai/providers/classes.dart';
import 'package:evaluateai/providers/evaluator.dart';
import 'package:evaluateai/utils/colors.dart';
import 'package:flutter/material.dart';
import 'package:flutter_feather_icons/flutter_feather_icons.dart';
import 'package:get/get.dart';
import 'package:provider/provider.dart';

class NewEditEvaluatorPage extends StatefulWidget {
  const NewEditEvaluatorPage({super.key});

  @override
  State<NewEditEvaluatorPage> createState() => _NewEditEvaluatorPageState();
}

class _NewEditEvaluatorPageState extends State<NewEditEvaluatorPage> {
  @override
  void initState() {
    Provider.of<ClassesProvider>(Get.context!, listen: false).getClasses();
    super.initState();
  }

  @override
  Widget build(BuildContext context) {
    String title = "";
    String description = "";
    String classId = "";

    var classesProvider = Provider.of<ClassesProvider>(context, listen: true);
    var evaluatorProvider = Provider.of<EvaluatorProvider>(context, listen: true);

    return Scaffold(
      body: SafeArea(
        child: Container(
          width: Get.width,
          height: Get.height,
          padding: const EdgeInsets.all(20),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                children: [
                  GetPlatform.isIOS
                      ? IconButton(
                          onPressed: () {
                            Get.back();
                          },
                          icon: Icon(FeatherIcons.arrowLeft),
                        )
                      : const SizedBox.shrink(),
                  Icon(FeatherIcons.play),
                  const SizedBox(width: 10),
                  Text(
                    "New Evaluator",
                    style: TextStyle(
                      fontSize: 20,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 20),
              Expanded(
                child: ListView(
                  children: [
                    Text("Title"),
                    const SizedBox(height: 10),
                    TextField(
                      onChanged: (value) {
                        title = value;
                      },
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
                      onChanged: (value) {
                        description = value;
                      },
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
                    classesProvider.classes.isEmpty
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
                          ),
                  ],
                ),
              ),
              const SizedBox(height: 10),
              Row(
                children: [
                  Expanded(
                    child: TextButton(
                      onPressed: () async {
                        await Provider.of<EvaluatorProvider>(context,
                                listen: false)
                            .createEvaluator(title, description, classId);
                        Get.back();
                      },
                      style: TextButton.styleFrom(
                        padding: EdgeInsets.symmetric(vertical: 15),
                        backgroundColor: primaryColor,
                        foregroundColor: Colors.white,
                      ),
                      child: evaluatorProvider.loading
                          ? SizedBox(
                              width: 20,
                              height: 20,
                              child: CircularProgressIndicator(
                                color: Colors.white,
                              ),
                            )
                          : Text("Create Evaluator"),
                    ),
                  ),
                ],
              ),
            ],
          ),
        ),
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
