import 'package:evaluateai/providers/classes.dart';
import 'package:flutter/material.dart';
import 'package:flutter_feather_icons/flutter_feather_icons.dart';
import 'package:get/get.dart';
import 'package:provider/provider.dart';

class ClassesPage extends StatefulWidget {
  const ClassesPage({super.key});

  @override
  State<ClassesPage> createState() => _ClassesPageState();
}

class _ClassesPageState extends State<ClassesPage> {
  @override
  void initState() {
    Provider.of<ClassesProvider>(context, listen: false).getClasses();
    super.initState();
  }

  @override
  Widget build(BuildContext context) {
    var provider = Provider.of<ClassesProvider>(context, listen: true);

    return Container(
      width: Get.width,
      height: Get.height,
      padding: const EdgeInsets.all(20),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Icon(FeatherIcons.users),
              const SizedBox(width: 10),
              Text(
                'Classes (${provider.classes.length})',
                style: TextStyle(
                  fontSize: 24,
                  fontWeight: FontWeight.bold,
                ),
              ),
            ],
          ),
          const SizedBox(height: 20),
          Consumer<ClassesProvider>(
            builder: (context, provider, child) {
              return Expanded(
                child: ListView.builder(
                  itemCount: provider.classes.length,
                  itemBuilder: (context, index) {
                    return ListTile(
                      title: Text(provider.classes[index]['subject']),
                      subtitle: Text(provider.classes[index]['name'] +
                          " " +
                          provider.classes[index]['section']),
                      contentPadding: EdgeInsets.zero,
                      leading: Icon(FeatherIcons.users),
                      onTap: () {},
                    );
                  },
                ),
              );
            },
          ),
        ],
      ),
    );
  }
}
