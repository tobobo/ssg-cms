echo_home:
	echo $$HOME

has_site_dir: echo_home
	if [ -z $$SSGCMS_SITE_DIR ]; then exit 1; else exit 0; fi

fetch: has_site_dir
	(cd $$SSGCMS_SITE_DIR && git fetch origin)

has_diff: has_site_dir fetch
	(cd $$SSGCMS_SITE_DIR && \
		if [ -z $$(git --no-pager diff --name-only $$SSGCMS_BASE_BRANCH) ]; then exit 1; else exit 0; fi)

push_revisions: has_site_dir
	(cd $$SSGCMS_SITE_DIR && \
		git checkout -b $$SSGCMS_SOURCE_BRANCH --quiet && \
		git add -A && \
		git commit -m "$$SSGCMS_COMMIT_MESSAGE" --allow-empty && \
		git push --force origin $$SSGCMS_SOURCE_BRANCH:$$SSGCMS_DESTINATION_BRANCH)
