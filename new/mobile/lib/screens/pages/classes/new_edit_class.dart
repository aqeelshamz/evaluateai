import 'package:evaluateai/providers/classes.dart';
import 'package:evaluateai/utils/colors.dart';
import 'package:flutter/material.dart';
import 'package:flutter_feather_icons/flutter_feather_icons.dart';
import 'package:get/get.dart';
import 'package:provider/provider.dart';

class NewEditClassPage extends StatefulWidget {
  const NewEditClassPage({super.key});

  @override
  State<NewEditClassPage> createState() => _NewEditClassPageState();
}

class _NewEditClassPageState extends State<NewEditClassPage> {
  String name = "";
  String section = "";
  String subject = "";

  @override
  Widget build(BuildContext context) {
    var classesProvider = Provider.of<ClassesProvider>(context, listen: true);

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
                  Icon(FeatherIcons.users),
                  const SizedBox(width: 10),
                  Text(
                    "New Class",
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
                    Text("Name"),
                    const SizedBox(height: 10),
                    TextField(
                      onChanged: (value) {
                        name = value;
                      },
                      decoration: InputDecoration(
                        hintText: "Name",
                        border: OutlineInputBorder(
                          borderRadius: BorderRadius.circular(15),
                        ),
                      ),
                    ),
                    const SizedBox(height: 20),
                    Text("Section"),
                    const SizedBox(height: 10),
                    TextField(
                      onChanged: (value) {
                        section = value;
                      },
                      decoration: InputDecoration(
                        hintText: "Section",
                        border: OutlineInputBorder(
                          borderRadius: BorderRadius.circular(15),
                        ),
                      ),
                    ),
                    const SizedBox(height: 20),
                    Text("Subject"),
                    const SizedBox(height: 10),
                    TextField(
                      onChanged: (value) {
                        subject = value;
                      },
                      decoration: InputDecoration(
                          hintText: "Subject",
                          border: OutlineInputBorder(
                            borderRadius: BorderRadius.circular(15),
                          )),
                    ),
                    const SizedBox(height: 20),
                  ],
                ),
              ),
              const SizedBox(height: 10),
              Row(
                children: [
                  Expanded(
                    child: TextButton(
                      onPressed: () async {
                        await Provider.of<ClassesProvider>(context,
                                listen: false)
                            .createClass(name, section, subject);
                        Get.back();
                      },
                      style: TextButton.styleFrom(
                        padding: EdgeInsets.symmetric(vertical: 15),
                        backgroundColor: primaryColor,
                        foregroundColor: Colors.white,
                      ),
                      child: classesProvider.loading
                          ? SizedBox(
                              width: 20,
                              height: 20,
                              child: CircularProgressIndicator(
                                color: Colors.white,
                              ),
                            )
                          : Text("Create Class"),
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
}
