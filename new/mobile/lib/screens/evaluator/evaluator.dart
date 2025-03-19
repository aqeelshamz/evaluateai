import 'package:evaluateai/providers/evaluator.dart';
import 'package:evaluateai/screens/evaluator/pages/answersheets.dart';
import 'package:evaluateai/screens/evaluator/pages/details.dart';
import 'package:evaluateai/screens/evaluator/pages/evaluate.dart';
import 'package:evaluateai/screens/evaluator/pages/materials.dart';
import 'package:evaluateai/screens/evaluator/pages/results.dart';
import 'package:flutter/material.dart';
import 'package:flutter_feather_icons/flutter_feather_icons.dart';
import 'package:get/get.dart';
import 'package:provider/provider.dart';

class EvaluatorScreen extends StatefulWidget {
  const EvaluatorScreen({super.key});

  @override
  State<EvaluatorScreen> createState() => _EvaluatorScreenState();
}

class _EvaluatorScreenState extends State<EvaluatorScreen> {
  int currentPageIndex = 0;
  PageController pageController = PageController();

  @override
  Widget build(BuildContext context) {
    var evaluatorProvider =
        Provider.of<EvaluatorProvider>(context, listen: true);

    return Scaffold(
      bottomNavigationBar: NavigationBar(
        onDestinationSelected: (int index) {
          setState(() {
            currentPageIndex = index;
          });
          pageController.jumpToPage(index);
        },
        selectedIndex: currentPageIndex,
        destinations: const <Widget>[
          NavigationDestination(
            icon: Icon(FeatherIcons.info),
            label: 'Details',
          ),
          NavigationDestination(
            icon: Icon(FeatherIcons.upload),
            label: 'Materials',
          ),
          NavigationDestination(
            icon: Icon(FeatherIcons.clipboard),
            label: 'Answers',
          ),
          NavigationDestination(
            icon: Icon(FeatherIcons.play),
            label: 'Evaluate',
          ),
          NavigationDestination(
            icon: Icon(Icons.emoji_events_outlined),
            label: 'Results',
          ),
        ],
      ),
      body: SafeArea(
        child: PageView(
          controller: pageController,
          children: const <Widget>[
            EvaluatorDetailsPage(),
            MaterialsPage(),
            AnswerSheetsPage(),
            EvaluatePage(),
            ResultsPage(),
          ],
          onPageChanged: (int index) {
            setState(() {
              currentPageIndex = index;
            });
          },
        ),
      ),
    );
  }
}
